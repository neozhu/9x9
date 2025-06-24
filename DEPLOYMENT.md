# 九九乘法表应用部署指南

## Docker 部署

### 前提条件
- 安装 Docker
- 安装 Docker Compose

### 快速开始

1. **使用 Docker Compose 一键部署**：
   ```bash
   docker-compose up -d
   ```

2. **访问应用**：
   打开浏览器访问 `http://localhost:3000`

3. **停止应用**：
   ```bash
   docker-compose down
   ```

### 手动 Docker 命令

如果你想使用原生 Docker 命令：

1. **构建镜像**：
   ```bash
   docker build -t 9x9-app .
   ```

2. **运行容器**：
   ```bash
   docker run -p 3000:3000 --name 9x9-app 9x9-app
   ```

3. **停止和删除容器**：
   ```bash
   docker stop 9x9-app
   docker rm 9x9-app
   ```

### 生产环境部署

#### 自定义端口
如果需要在不同端口运行，修改 `docker-compose.yml` 中的端口映射：
```yaml
ports:
  - "8080:3000"  # 将应用映射到 8080 端口
```

#### 使用反向代理 (Nginx)
创建 `docker-compose.prod.yml` 文件：

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
    restart: unless-stopped
    container_name: 9x9-app
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro  # SSL 证书目录
    depends_on:
      - app
    restart: unless-stopped
    container_name: 9x9-nginx
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### 故障排除

#### 查看日志
```bash
# 查看应用日志
docker-compose logs app

# 实时查看日志
docker-compose logs -f app
```

#### 重新构建
如果代码有更新，需要重新构建：
```bash
docker-compose up --build -d
```

#### 清理资源
```bash
# 停止并删除容器、网络
docker-compose down

# 删除镜像
docker rmi 9x9-app

# 清理未使用的 Docker 资源
docker system prune
```

### 性能优化

当前 Dockerfile 已包含以下优化：
- 多阶段构建，减小最终镜像大小
- 使用 Alpine Linux 基础镜像
- 非 root 用户运行应用
- 启用 Next.js standalone 输出模式
- 健康检查配置

### 环境变量

可以通过创建 `.env` 文件来配置环境变量：
```env
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1
```

然后在 `docker-compose.yml` 中引用：
```yaml
services:
  app:
    env_file:
      - .env
``` 