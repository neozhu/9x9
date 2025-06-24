# 使用 Nginx 作为基础镜像
FROM nginx:alpine

# 创建工作目录
WORKDIR /usr/share/nginx/html

# 复制网站文件到容器中
COPY index.html /usr/share/nginx/html/
COPY screenshot.png /usr/share/nginx/html/

# 暴露 80 端口
EXPOSE 80

# 使用 Nginx 默认命令启动
CMD ["nginx", "-g", "daemon off;"]
