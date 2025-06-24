# 使用 Docker Compose 部署指南

这个文件包含了使用 Docker Compose 来部署小先生乘法表应用的说明。

## 前提条件

- 已安装 [Docker](https://docs.docker.com/get-docker/) 和 [Docker Compose](https://docs.docker.com/compose/install/)

## 部署步骤

1. 打开终端/命令提示符/PowerShell，进入项目根目录（包含 `docker-compose.yml` 的目录）

2. 使用以下命令启动应用：

   ```bash
   docker-compose up -d
   ```

   `-d` 参数表示在后台运行。

3. 应用将在 http://localhost:4017 上可用

## 停止应用

停止并移除容器：

```bash
docker-compose down
```

## 查看日志

```bash
docker-compose logs -f
```

## 重新构建并启动

如果你对代码进行了修改，你可能需要重新构建镜像：

```bash
docker-compose up -d --build
```

## 容器配置说明

- 端口映射：`4017:80` - 将容器的80端口映射到主机的4017端口
- 卷挂载：`./:/usr/share/nginx/html:ro` - 将当前目录挂载到容器的 `/usr/share/nginx/html`，使用只读模式（ro）
- 容器名称：`multiplication-table-app`
- 重启策略：`unless-stopped` - 除非手动停止，否则容器会在退出时自动重启
