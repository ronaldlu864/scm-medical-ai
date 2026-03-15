#!/bin/bash

# SCM Medical AI Suite - 一键部署脚本
# 使用方法: ./deploy.sh

set -e  # 遇到错误立即退出

echo "=========================================="
echo "  SCM Medical AI Suite - 部署脚本"
echo "=========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 打印信息
info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# 打印成功
success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# 打印警告
warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# 打印错误
error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查必要的环境变量
check_env() {
    info "检查环境变量..."
    
    if [ ! -f ".env" ]; then
        error ".env 文件不存在!"
        echo ""
        echo "请创建 .env 文件，内容如下:"
        echo "VITE_SUPABASE_URL=https://your-project.supabase.co"
        echo "VITE_SUPABASE_ANON_KEY=your-anon-key"
        echo "VITE_OPENAI_API_KEY=sk-your-key"
        echo ""
        exit 1
    fi
    
    # 加载环境变量
    export $(grep -v '^#' .env | xargs)
    
    if [ -z "$VITE_SUPABASE_URL" ]; then
        error "VITE_SUPABASE_URL 未设置"
        exit 1
    fi
    
    if [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
        error "VITE_SUPABASE_ANON_KEY 未设置"
        exit 1
    fi
    
    success "环境变量检查通过"
}

# 检查 Node.js
check_node() {
    info "检查 Node.js..."
    
    if ! command_exists node; then
        error "Node.js 未安装!"
        echo "请访问 https://nodejs.org/ 安装 Node.js 18+"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        error "Node.js 版本过低，需要 18+"
        exit 1
    fi
    
    success "Node.js 版本: $(node -v)"
}

# 检查 npm
check_npm() {
    info "检查 npm..."
    
    if ! command_exists npm; then
        error "npm 未安装!"
        exit 1
    fi
    
    success "npm 版本: $(npm -v)"
}

# 安装依赖
install_deps() {
    info "安装依赖..."
    
    if [ -d "node_modules" ]; then
        warn "node_modules 已存在，跳过安装"
    else
        npm install
        success "依赖安装完成"
    fi
}

# 构建项目
build_project() {
    info "构建项目..."
    
    npm run build
    
    if [ ! -d "dist" ]; then
        error "构建失败，dist 目录不存在"
        exit 1
    fi
    
    success "构建完成"
}

# 部署到服务器 (通过 rsync)
deploy_rsync() {
    info "部署到服务器 (rsync)..."
    
    read -p "请输入服务器地址 (user@host): " SERVER
    read -p "请输入部署路径 (如 /var/www/smie.scmpts.com): " DEPLOY_PATH
    
    if [ -z "$SERVER" ] || [ -z "$DEPLOY_PATH" ]; then
        error "服务器地址或部署路径不能为空"
        exit 1
    fi
    
    info "上传文件到 $SERVER:$DEPLOY_PATH..."
    rsync -avz --delete dist/ "$SERVER:$DEPLOY_PATH/"
    
    success "部署完成!"
    echo ""
    echo "网站地址: http://smie.scmpts.com"
}

# 部署到本地目录
deploy_local() {
    info "部署到本地目录..."
    
    read -p "请输入部署路径 (如 /var/www/smie.scmpts.com): " DEPLOY_PATH
    
    if [ -z "$DEPLOY_PATH" ]; then
        error "部署路径不能为空"
        exit 1
    fi
    
    # 创建目录
    sudo mkdir -p "$DEPLOY_PATH"
    
    # 复制文件
    sudo cp -r dist/* "$DEPLOY_PATH/"
    
    # 设置权限
    sudo chown -R www-data:www-data "$DEPLOY_PATH"
    sudo chmod -R 755 "$DEPLOY_PATH"
    
    success "部署完成!"
    echo ""
    echo "网站地址: http://localhost 或你的域名"
}

# 生成 Nginx 配置
generate_nginx() {
    info "生成 Nginx 配置..."
    
    cat > nginx-smie.conf << 'EOF'
server {
    listen 80;
    server_name smie.scmpts.com;
    
    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name smie.scmpts.com;

    # SSL 证书路径 (请修改为你的实际路径)
    ssl_certificate /path/to/your/cert.pem;
    ssl_certificate_key /path/to/your/key.pem;

    # 网站根目录
    root /var/www/smie.scmpts.com;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 前端路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

    success "Nginx 配置已生成: nginx-smie.conf"
    echo ""
    echo "使用步骤:"
    echo "1. 修改 SSL 证书路径"
    echo "2. 复制到 /etc/nginx/sites-available/"
    echo "3. 创建软链接: ln -s /etc/nginx/sites-available/nginx-smie.conf /etc/nginx/sites-enabled/"
    echo "4. 测试配置: nginx -t"
    echo "5. 重启 Nginx: systemctl restart nginx"
}

# 主菜单
main_menu() {
    echo ""
    echo "请选择部署方式:"
    echo "1) 部署到远程服务器 (rsync)"
    echo "2) 部署到本地目录"
    echo "3) 仅生成 Nginx 配置"
    echo "4) 退出"
    echo ""
    read -p "请输入选项 [1-4]: " CHOICE
    
    case $CHOICE in
        1)
            deploy_rsync
            ;;
        2)
            deploy_local
            ;;
        3)
            generate_nginx
            ;;
        4)
            info "退出部署"
            exit 0
            ;;
        *)
            error "无效选项"
            exit 1
            ;;
    esac
}

# 主函数
main() {
    echo ""
    info "开始部署流程..."
    echo ""
    
    # 检查
    check_node
    check_npm
    check_env
    
    # 安装依赖
    install_deps
    
    # 构建
    build_project
    
    # 部署菜单
    main_menu
    
    echo ""
    echo "=========================================="
    success "部署完成!"
    echo "=========================================="
}

# 运行主函数
main
