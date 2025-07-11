# 使用官方 Node.js 18 镜像作为基础镜像
FROM node:18-alpine AS base

# 安装依赖所需的包
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 安装依赖
FROM base AS deps
# 复制 package files
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# 构建应用
FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .

# 禁用 Next.js 遥测
ENV NEXT_TELEMETRY_DISABLED=1

# 构建应用
RUN npm run build

# 生产镜像，复制所有文件并运行应用
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建产物
COPY --from=builder /app/public ./public

# 为 standalone 输出设置权限
RUN mkdir .next
RUN chown nextjs:nodejs .next

# 复制构建的应用
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 启动应用
CMD ["node", "server.js"] 