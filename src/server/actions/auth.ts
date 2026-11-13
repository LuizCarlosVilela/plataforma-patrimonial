"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Preencha todos os campos." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "E-mail ou senha incorretos." };
    }

    // Se o usuário possui senha no banco, valida com bcrypt
    if (user.password) {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return { error: "E-mail ou senha incorretos." };
      }
    }

    return { success: true, role: user.role || "CLIENT" };
  } catch (err: any) {
    console.error("Erro no login:", err);
    return { error: "Erro interno no servidor. Tente novamente." };
  }
}

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Preencha todos os campos." };
  }

  if (password.length < 8) {
    return { error: "A senha deve ter pelo menos 8 caracteres." };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Este e-mail já está cadastrado." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "CLIENT",
        planTier: "FREE",
      },
    });

    // Simulação de disparo de e-mail de boas-vindas / notificação
    console.log(`[EMAIL DISPARADO] Bem-vindo à Origin, ${name}! E-mail enviado para: ${email}`);

    return { success: true, userId: newUser.id };
  } catch (err: any) {
    console.error("Erro no cadastro:", err);
    return { error: "Erro ao cadastrar usuário. Tente novamente." };
  }
}
