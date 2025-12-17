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
DEFAULT_INSTALL_DIR="$HOME/.local/bin"
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

# Determine installation directory
determine_install_dir() {
    # If user specified a directory via env var, use that
    if [ -n "$FLOWDECK_INSTALL_DIR" ]; then
        INSTALL_DIR="$FLOWDECK_INSTALL_DIR"
    else
        INSTALL_DIR="$DEFAULT_INSTALL_DIR"
    fi
}

# Download the binary
download() {
    DOWNLOAD_URL="${DOWNLOAD_BASE}/${VERSION}/flowdeck-${OS}-${ARCH}.tar.gz"

    info "Downloading FlowDeck CLI ${VERSION}..."

    # Create temp directory
    TMP_DIR=$(mktemp -d)
    trap "rm -rf $TMP_DIR" EXIT

    # Download
    HTTP_CODE=$(curl -sSL -w "%{http_code}" "$DOWNLOAD_URL" -o "$TMP_DIR/flowdeck.tar.gz" 2>/dev/null || echo "000")

    if [ "$HTTP_CODE" != "200" ]; then
        error "Failed to download FlowDeck CLI (HTTP $HTTP_CODE). Version ${VERSION} may not exist."
    fi

    # Extract
    info "Extracting..."
    tar -xzf "$TMP_DIR/flowdeck.tar.gz" -C "$TMP_DIR"

    DOWNLOADED_BINARY="$TMP_DIR/$BINARY_NAME"
}

# Install the binary
install_binary() {
    # Create install directory if needed
    if [ ! -d "$INSTALL_DIR" ]; then
        info "Creating directory $INSTALL_DIR..."
        mkdir -p "$INSTALL_DIR"
    fi

    # Check for existing installation
    if [ -f "$INSTALL_DIR/$BINARY_NAME" ]; then
        OLD_VERSION=$("$INSTALL_DIR/$BINARY_NAME" --version 2>/dev/null | head -1 || echo "unknown")
        if [ "$OLD_VERSION" != "$VERSION" ] && [ "$OLD_VERSION" != "unknown" ]; then
            info "Upgrading from ${OLD_VERSION} to ${VERSION}..."
        fi
    fi

    # Install binary
    info "Installing to $INSTALL_DIR/$BINARY_NAME..."
    cp "$DOWNLOADED_BINARY" "$INSTALL_DIR/$BINARY_NAME"
    chmod 755 "$INSTALL_DIR/$BINARY_NAME"
    xattr -d com.apple.quarantine "$INSTALL_DIR/$BINARY_NAME" 2>/dev/null || true
}

# Check if install directory is in PATH
check_path() {
    case ":$PATH:" in
        *":$INSTALL_DIR:"*) return 0 ;;
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
    if ! "$INSTALL_DIR/$BINARY_NAME" --version >/dev/null 2>&1; then
        error "Installation verification failed. The binary may be corrupted."
    fi
}

# Print success message
print_success() {
    echo ""
    success "FlowDeck CLI ${VERSION} installed successfully!"
    echo ""

    if ! check_path; then
        suggest_path_config
    else
        echo "Get started:"
        echo ""
        printf "  ${BOLD}flowdeck --help${NC}\n"
        printf "  ${BOLD}flowdeck -i${NC}          # Interactive mode\n"
        echo ""
    fi

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
