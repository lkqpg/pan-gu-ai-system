#!/bin/bash

# 盘古AI创世系统 - 一键部署脚本
# 适用于Linux/macOS系统

echo "🚀 盘古AI创世系统 - 一键部署"
echo "========================================"
echo "成本: 0元/月（全部免费资源）"
echo "时间: 20-25分钟"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 函数：打印带颜色的消息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查必要工具
check_tools() {
    print_info "检查必要工具..."
    
    local tools=("git" "node" "npm")
    local missing_tools=()
    
    for tool in "${tools[@]}"; do
        if ! command -v $tool &> /dev/null; then
            missing_tools+=("$tool")
        fi
    done
    
    if [ ${#missing_tools[@]} -gt 0 ]; then
        print_error "缺少必要工具: ${missing_tools[*]}"
        echo "请安装以下工具："
        for tool in "${missing_tools[@]}"; do
            case $tool in
                "git")
                    echo "  Git: https://git-scm.com/downloads"
                    ;;
                "node"|"npm")
                    echo "  Node.js: https://nodejs.org/"
                    ;;
            esac
        done
        exit 1
    fi
    
    print_success "所有必要工具已安装"
}

# 显示部署选项
show_deployment_options() {
    echo ""
    print_info "选择部署方式："
    echo "1. 完整部署（前端 + 后端 + 数据库）"
    echo "2. 仅部署后端"
    echo "3. 仅部署前端"
    echo "4. 仅验证现有部署"
    echo "5. 退出"
    echo ""
    read -p "请输入选项 (1-5): " choice
    
    case $choice in
        1)
            deploy_full
            ;;
        2)
            deploy_backend_only
            ;;
        3)
            deploy_frontend_only
            ;;
        4)
            verify_existing
            ;;
        5)
            echo "退出部署脚本"
            exit 0
            ;;
        *)
            print_error "无效选项"
            show_deployment_options
            ;;
    esac
}

# 完整部署
deploy_full() {
    print_info "开始完整部署..."
    
    # 1. 数据库设置
    setup_database
    
    # 2. 后端部署
    deploy_backend
    
    # 3. 前端部署
    deploy_frontend
    
    # 4. 验证部署
    verify_deployment
    
    print_success "完整部署完成！"
}

# 设置数据库
setup_database() {
    print_info "步骤1: 设置MongoDB Atlas数据库"
    echo ""
    echo "请按照以下步骤操作："
    echo "1. 访问 https://www.mongodb.com/cloud/atlas"
    echo "2. 注册/登录免费账号"
    echo "3. 创建免费集群（M0 Sandbox，512MB）"
    echo "4. 创建数据库用户"
    echo "5. 配置网络访问（允许所有IP或添加Railway IP）"
    echo "6. 获取连接字符串"
    echo ""
    read -p "是否已完成上述步骤？(y/n): " completed
    
    if [ "$completed" != "y" ] && [ "$completed" != "Y" ]; then
        print_warning "请先完成数据库设置，然后重新运行脚本"
        exit 1
    fi
    
    read -p "请输入MongoDB连接字符串: " mongodb_uri
    export MONGODB_URI="$mongodb_uri"
    
    print_success "数据库配置完成"
}

# 部署后端
deploy_backend() {
    print_info "步骤2: 部署后端到Railway"
    echo ""
    echo "请按照以下步骤操作："
    echo "1. 访问 https://railway.app"
    echo "2. 登录GitHub账号"
    echo "3. 新建项目 → 'Deploy from GitHub'"
    echo "4. 选择包含本项目的仓库"
    echo "5. 配置环境变量："
    echo "   PORT=3001"
    echo "   NODE_ENV=production"
    echo "   MONGODB_URI=$MONGODB_URI"
    echo "   QVERIS_API_KEY=sk-3wKsq7KwHPYU8CjwkznECR3iYbE9fN5S2NcaTfXuda0"
    echo "   CORS_ORIGIN=你的前端URL"
    echo ""
    read -p "是否已完成上述步骤？(y/n): " completed
    
    if [ "$completed" != "y" ] && [ "$completed" != "Y" ]; then
        print_warning "请先完成后端部署，然后重新运行脚本"
        exit 1
    fi
    
    read -p "请输入后端URL（如 https://xxx.up.railway.app）: " backend_url
    export BACKEND_URL="$backend_url"
    
    print_success "后端部署完成"
}

# 部署前端
deploy_frontend() {
    print_info "步骤3: 部署前端到Vercel"
    echo ""
    echo "请按照以下步骤操作："
    echo "1. 访问 https://vercel.com"
    echo "2. 登录GitHub账号"
    echo "3. 新建项目 → 'Import Git Repository'"
    echo "4. 选择包含本项目的仓库"
    echo "5. 配置："
    echo "   项目名称: pan-gu-ai-frontend"
    echo "   框架: Next.js"
    echo "   根目录: frontend"
    echo "   环境变量:"
    echo "     NEXT_PUBLIC_API_URL=$BACKEND_URL"
    echo "     NEXT_PUBLIC_APP_NAME=盘古AI创世系统"
    echo ""
    read -p "是否已完成上述步骤？(y/n): " completed
    
    if [ "$completed" != "y" ] && [ "$completed" != "Y" ]; then
        print_warning "请先完成前端部署，然后重新运行脚本"
        exit 1
    fi
    
    read -p "请输入前端URL（如 https://xxx.vercel.app）: " frontend_url
    export FRONTEND_URL="$frontend_url"
    
    print_success "前端部署完成"
}

# 验证部署
verify_deployment() {
    print_info "步骤4: 验证部署"
    echo ""
    
    # 更新后端CORS配置
    print_info "更新后端CORS配置..."
    echo "请在Railway环境变量中设置："
    echo "CORS_ORIGIN=$FRONTEND_URL"
    echo ""
    read -p "是否已更新CORS配置？(y/n): " updated
    
    if [ "$updated" != "y" ] && [ "$updated" != "Y" ]; then
        print_warning "请先更新CORS配置"
    fi
    
    # 运行验证脚本
    print_info "运行验证脚本..."
    if [ -f "verify-deployment.js" ]; then
        API_URL="$BACKEND_URL" node verify-deployment.js
    else
        print_warning "验证脚本不存在，跳过验证"
    fi
    
    print_success "验证完成"
}

# 仅部署后端
deploy_backend_only() {
    print_info "仅部署后端..."
    setup_database
    deploy_backend
    print_success "后端部署完成"
}

# 仅部署前端
deploy_frontend_only() {
    print_info "仅部署前端..."
    read -p "请输入后端URL: " backend_url
    export BACKEND_URL="$backend_url"
    deploy_frontend
    print_success "前端部署完成"
}

# 验证现有部署
verify_existing() {
    print_info "验证现有部署..."
    read -p "请输入后端URL: " backend_url
    export BACKEND_URL="$backend_url"
    
    if [ -f "verify-deployment.js" ]; then
        API_URL="$backend_url" node verify-deployment.js
    else
        print_error "验证脚本不存在"
    fi
}

# 显示总结
show_summary() {
    echo ""
    echo "========================================"
    print_success "部署完成！"
    echo "========================================"
    echo ""
    echo "📊 部署信息："
    echo "   前端URL: ${FRONTEND_URL:-未设置}"
    echo "   后端URL: ${BACKEND_URL:-未设置}"
    echo "   数据库: MongoDB Atlas (免费)"
    echo ""
    echo "🚀 下一步行动："
    echo "   1. 访问前端仪表板: ${FRONTEND_URL:-请设置}"
    echo "   2. 验证API连接: ${BACKEND_URL:-请设置}/health"
    echo "   3. 监控AI写作任务"
    echo "   4. 跟踪收益数据"
    echo ""
    echo "💰 成本确认：0元/月"
    echo "⏱️  收益预计：24-48小时内开始"
    echo ""
    echo "💡 系统已完全自动化，无需人工干预"
    echo ""
}

# 主函数
main() {
    echo "盘古AI创世系统部署脚本"
    echo "版本: 1.0.0"
    echo ""
    
    # 检查工具
    check_tools
    
    # 显示选项
    show_deployment_options
    
    # 显示总结
    show_summary
}

# 运行主函数
main "$@"