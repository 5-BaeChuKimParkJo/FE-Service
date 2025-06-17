# ---------- Build Stage ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Build argument 추가
ARG NEXT_PUBLIC_S3_HOSTNAME
ENV NEXT_PUBLIC_S3_HOSTNAME=$NEXT_PUBLIC_S3_HOSTNAME

# 패키지 설치
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# 전체 소스 복사 후 빌드
COPY . .
RUN pnpm build

# ---------- Production Stage ----------
FROM node:18-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Production 환경변수 설정
ARG NEXT_PUBLIC_S3_HOSTNAME
ENV NEXT_PUBLIC_S3_HOSTNAME=$NEXT_PUBLIC_S3_HOSTNAME

RUN npm install -g pnpm

# 빌드 결과물만 복사 (경량화)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

# (Prisma 등 다른 디렉토리도 필요하면 여기에 추가)
# COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["pnpm", "start"]