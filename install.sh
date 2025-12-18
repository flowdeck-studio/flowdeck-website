#!/bin/sh
# FlowDeck CLI Installer
# Usage: curl -sSL https://flowdeck.studio/installer/cli.sh | sh
#
# Environment variables:
#   FLOWDECK_INSTALL_DIR - Installation directory (overrides default)
#   FLOWDECK_VERSION     - Specific version to install (default: latest)

set -e

# Configuration
DOWNLOAD_BASE="https://s3.eu-north-1.amazonaws.com/flowdeck.public/releases/cli"
DEFAULT_SHARE_DIR="$HOME/.local/share/flowdeck"
DEFAULT_BIN_DIR="$HOME/.local/bin"
BINARY_NAME="flowdeck"

# Colors (disabled if not a terminal)
if [ -t 1 ]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[0;33m'
    BLUE='\033[0;34m'
    BOLD='\033[1m'
    DIM='\033[2m'
    NC='\033[0m'
else
    RED=''
    GREEN=''
    YELLOW=''
    BLUE=''
    BOLD=''
    DIM=''
    NC=''
fi

info() {
    printf "${BLUE}==>${NC} ${BOLD}%s${NC}\n" "$1"
}

success() {
    printf "${GREEN}==>${NC} ${BOLD}%s${NC}\n" "$1"
}

warn() {
    printf "${YELLOW}Warning:${NC} %s\n" "$1"
}

error() {
    printf "${RED}Error:${NC} %s\n" "$1" >&2
    exit 1
}

# Check for required commands
check_requirements() {
    for cmd in curl tar; do
        if ! command -v "$cmd" >/dev/null 2>&1; then
            error "Required command not found: $cmd"
        fi
    done
}

# Detect OS
detect_os() {
    OS="$(uname -s)"
    case "$OS" in
        Darwin) OS="darwin" ;;
        *) error "Unsupported operating system: $OS. FlowDeck CLI only supports macOS." ;;
    esac
}

# Detect architecture
detect_arch() {
    ARCH="$(uname -m)"
    case "$ARCH" in
        x86_64) ARCH="x64" ;;
        arm64|aarch64) ARCH="arm64" ;;
        *) error "Unsupported architecture: $ARCH" ;;
    esac
}

# Get latest version or use specified version
get_version() {
    if [ -n "$FLOWDECK_VERSION" ]; then
        VERSION="$FLOWDECK_VERSION"
        info "Installing specified version: ${VERSION}"
    else
        info "Checking for latest version..."
        VERSION=$(curl -sSL "${DOWNLOAD_BASE}/latest.txt" 2>/dev/null || echo "")

        if [ -z "$VERSION" ]; then
            error "Failed to determine latest version. Check your internet connection."
        fi
    fi
}

# Determine installation directories
determine_install_dir() {
    # If user specified a directory via env var, use that for bin
    if [ -n "$FLOWDECK_INSTALL_DIR" ]; then
        BIN_DIR="$FLOWDECK_INSTALL_DIR"
    else
        BIN_DIR="$DEFAULT_BIN_DIR"
    fi
    SHARE_DIR="$DEFAULT_SHARE_DIR"
}

# Download and extract
download() {
    DOWNLOAD_URL="${DOWNLOAD_BASE}/${VERSION}/flowdeck-${OS}-${ARCH}.tar.gz"

    info "Downloading FlowDeck CLI ${VERSION}..."

    # Create temp directory
    TMP_DIR=$(mktemp -d)
    trap 'rm -rf "$TMP_DIR"' EXIT

    # Download
    HTTP_CODE=$(curl -sSL -w "%{http_code}" "$DOWNLOAD_URL" -o "$TMP_DIR/flowdeck.tar.gz" 2>/dev/null || echo "000")

    if [ "$HTTP_CODE" != "200" ]; then
        error "Failed to download FlowDeck CLI (HTTP $HTTP_CODE). Version ${VERSION} may not exist."
    fi

    # Extract
    info "Extracting..."
    tar -xzf "$TMP_DIR/flowdeck.tar.gz" -C "$TMP_DIR"
}

# Install binary and resources to share, symlink to bin
install_binary() {
    info "Installing..."

    # Create directories
    mkdir -p "$SHARE_DIR"
    mkdir -p "$BIN_DIR"

    # Clean up old layouts
    rm -rf "$BIN_DIR/flowdeck-cli_FlowDeckCore.bundle"
    rm -rf "$SHARE_DIR/flowdeck-cli_FlowDeckCore.bundle"
    rm -f "$BIN_DIR/$BINARY_NAME"

    # Install binary to share directory
    cp "$TMP_DIR/$BINARY_NAME" "$SHARE_DIR/$BINARY_NAME"
    chmod 755 "$SHARE_DIR/$BINARY_NAME"
    xattr -d com.apple.quarantine "$SHARE_DIR/$BINARY_NAME" 2>/dev/null || true

    # Install resources
    mkdir -p "$SHARE_DIR/resources"
    if [ -f "$TMP_DIR/resources/SKILL.md" ]; then
        cp "$TMP_DIR/resources/SKILL.md" "$SHARE_DIR/resources/"
    fi
    if [ -f "$TMP_DIR/resources/flowdeck-guard.sh" ]; then
        cp "$TMP_DIR/resources/flowdeck-guard.sh" "$SHARE_DIR/resources/"
        chmod 755 "$SHARE_DIR/resources/flowdeck-guard.sh"
    fi

    # Create symlink in bin directory
    # Handle case where target is a directory (edge case)
    [ -d "$BIN_DIR/$BINARY_NAME" ] && rm -rf "$BIN_DIR/$BINARY_NAME"
    ln -sf "$SHARE_DIR/$BINARY_NAME" "$BIN_DIR/$BINARY_NAME"
}

# Check if bin directory is in PATH
check_path() {
    case ":$PATH:" in
        *":$BIN_DIR:"*) return 0 ;;
        *) return 1 ;;
    esac
}

# Suggest PATH configuration
suggest_path_config() {
    SHELL_NAME=$(basename "$SHELL")

    case "$SHELL_NAME" in
        zsh)
            RC_FILE="~/.zshrc"
            ;;
        bash)
            if [ -f "$HOME/.bash_profile" ]; then
                RC_FILE="~/.bash_profile"
            else
                RC_FILE="~/.bashrc"
            fi
            ;;
        fish)
            RC_FILE="~/.config/fish/config.fish"
            ;;
        *)
            RC_FILE="your shell config"
            ;;
    esac

    echo ""
    warn "~/.local/bin is not in your PATH"
    echo ""
    echo "Run this command to add it:"
    echo ""
    if [ "$SHELL_NAME" = "fish" ]; then
        printf "  ${BOLD}echo 'fish_add_path ~/.local/bin' >> %s && source %s${NC}\n" "$RC_FILE" "$RC_FILE"
    else
        printf "  ${BOLD}echo 'export PATH=\"\$HOME/.local/bin:\$PATH\"' >> %s && source %s${NC}\n" "$RC_FILE" "$RC_FILE"
    fi
    echo ""
}

# Verify installation
verify_install() {
    if ! "$BIN_DIR/$BINARY_NAME" --version >/dev/null 2>&1; then
        error "Installation verification failed. The binary may be corrupted."
    fi
}

# Print success message
print_success() {
    echo ""
    success "FlowDeck CLI ${VERSION} installed successfully!"
    echo ""
    echo "Location: ~/.local/share/flowdeck/"
    echo "Symlink:  ~/.local/bin/flowdeck"
    echo ""

    if ! check_path; then
        suggest_path_config
    fi

    echo "Get started:"
    echo ""
    printf "  ${BOLD}flowdeck --help${NC}\n"
    printf "  ${BOLD}flowdeck -i${NC}          # Interactive mode\n"
    echo ""
    echo "Documentation: https://docs.flowdeck.studio/cli/"
    echo ""
}

# Main
main() {
    echo ""
    printf "${BOLD}FlowDeck CLI Installer${NC}\n"
    echo ""

    check_requirements
    detect_os
    detect_arch
    get_version
    determine_install_dir
    download
    install_binary
    verify_install
    print_success
}

main "$@"
