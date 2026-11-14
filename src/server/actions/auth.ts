import { signIn } from "next-auth/react";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, error: "Usuário não encontrado" };
    }

    const isValid = await bcrypt.compare(password, user.password!);
    if (!isValid) {
      return { success: false, error: "Senha incorreta" };
    }

    return { success: true, role: user.role || "CLIENT" };
  } catch (error) {
    return { success: false, error: "Erro ao autenticar usuário" };
  }
}

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "CLIENT",
        planTier: "FREE",
      },
    });
    return { success: true, role: user.role || "CLIENT" };
  } catch (error) {
    return { success: false, error: "Erro ao registrar usuário" };
  }
}

export async function googleLogin() {
  try {
    await signIn("google", { callbackUrl: "/dashboard" });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao autenticar com Google" };
  }
}