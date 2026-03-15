# SCM Medical AI Suite - 部署指南

## 快速开始 (5分钟部署)

### 第一步：配置 Supabase (2分钟)

1. 登录 [supabase.com](https://supabase.com)
2. 创建新项目
3. 进入 **SQL Editor**
4. 复制粘贴 `database/schema.sql` 全部内容并执行
5. 进入 **Storage** → 创建 bucket 名为 `documents`，设为 Public

### 第二步：获取 API 密钥 (1分钟)

进入 **Project Settings** → **API**，复制：
- `Project URL`
- `anon public` key

### 第三步：配置环境变量 (1分钟)

在项目根目录创建 `.env` 文件：

```bash
cat > .env << 'EOF'
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
VITE_OPENAI_API_KEY=sk-...
EOF
```

### 第四步：运行部署脚本 (1分钟)

```bash
./deploy.sh
```

按提示选择部署方式即可。

---

## 手动部署步骤

如果不想用脚本，可以手动执行：

```bash
# 1. 安装依赖
npm install

# 2. 构建
npm run build

# 3. 上传 dist 文件夹到你的服务器
rsync -avz dist/ user@server:/var/www/smie.scmpts.com/
```

---

## Nginx 配置示例

```nginx
server {
    listen 80;
    server_name smie.scmpts.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name smie.scmpts.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /var/www/smie.scmpts.com;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 常见问题

### Q: 登录后页面空白？
A: 检查 `.env` 中的 Supabase URL 和 Key 是否正确

### Q: 注册后收不到验证邮件？
A: 在 Supabase Auth Settings 中配置邮件 SMTP

### Q: 如何添加管理员账号？
A: 注册后在 Supabase 数据库中修改 `user_profiles.role` 为 `admin`

---

## 需要帮忙？

遇到问题随时联系！
