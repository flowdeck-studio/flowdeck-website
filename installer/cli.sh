#!/bin/sh
# FlowDeck CLI Installer
# Usage: curl -sSL https://flowdeck.studio/install.sh | sh
#
# Environment variables:
#   FLOWDECK_INSTALL_DIR - Installation directory (default: ~/.local/bin)
#   FLOWDECK_VERSION     - Specific version to install (default: latest)

set -e

# Configuration
DOWNLOAD_BASE="https://s3.eu-north-1.amazonaws.com/flowdeck.public/releases/cli"
INSTALL_DIR="${FLOWDECK_INSTALL_DIR:-$HOME/.local/bin}"
BINARY_NAME="flowdeck"

# Colors (disabled if not a terminal)
if [ -t 1 ]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[0;33m'
    BLUE='\033[0;34m'
    BOLD='\033[1m'
    NC='\033[0m'
else
    RED=''
    GREEN=''
    YELLOW=''
    BLUE=''
    BOLD=''
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

# Download and install
install() {
    DOWNLOAD_URL="${DOWNLOAD_BASE}/${VERSION}/flowdeck-${OS}-${ARCH}.tar.gz"

    info "Downloading FlowDeck CLI ${VERSION} for ${OS}-${ARCH}..."

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
    mv "$TMP_DIR/$BINARY_NAME" "$INSTALL_DIR/$BINARY_NAME"
    chmod +x "$INSTALL_DIR/$BINARY_NAME"

    # Remove quarantine attribute (macOS) - this is why we use our own installer
    if [ "$OS" = "darwin" ]; then
        xattr -d com.apple.quarantine "$INSTALL_DIR/$BINARY_NAME" 2>/dev/null || true
    fi
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
            RC_FILE="$HOME/.zshrc"
            ;;
        bash)
            if [ -f "$HOME/.bash_profile" ]; then
                RC_FILE="$HOME/.bash_profile"
            else
                RC_FILE="$HOME/.bashrc"
            fi
            ;;
        fish)
            RC_FILE="$HOME/.config/fish/config.fish"
            ;;
        *)
            RC_FILE="your shell's config file"
            ;;
    esac

    echo ""
    warn "$INSTALL_DIR is not in your PATH"
    echo ""
    echo "Add this to ${RC_FILE}:"
    echo ""
    if [ "$SHELL_NAME" = "fish" ]; then
        printf "  ${BOLD}set -gx PATH \$HOME/.local/bin \$PATH${NC}\n"
    else
        printf "  ${BOLD}export PATH=\"\$HOME/.local/bin:\$PATH\"${NC}\n"
    fi
    echo ""
    echo "Then run:"
    echo ""
    printf "  ${BOLD}source ${RC_FILE}${NC}\n"
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

    echo "Documentation: https://flowdeck.dev/docs"
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
    install
    verify_install
    print_success
}

main "$@"
