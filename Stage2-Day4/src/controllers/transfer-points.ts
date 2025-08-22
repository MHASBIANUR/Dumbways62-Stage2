import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export const transferPoints = async (req: Request, res: Response, next: any) => {
    const { amount, senderId, receiverId } = req.body;

    console.log(amount, senderId, receiverId);
    
  try {
    if (amount <= 0) {
      throw { status: 400, message: "Jumlah point harus lebih dari 0" };
    }

    const [sender, receiver] = await Promise.all([
      prisma.user.findUnique({ where: { id:senderId } }),
      prisma.user.findUnique({ where: { id:receiverId } }),
    ]);

    
    if (!sender) {
        res.status(400).json ({message: "Pengirim tidak ditemukan"})
        return;
    }
    if (!receiver) {
        res.status(400).json ({message: "Penerima tidak ditemukan"})
        return;
    }    
    if (sender.points < amount) {
        res.status(400).json ({ message: "Point tidak mencukupi" });
    }

    await prisma.$transaction(async (tx)=>{
        await tx.user.update({
            where:{id:senderId},
            data:{points:{decrement:amount}}
        })

        await tx.user.update({
            where:{id:receiverId},
            data:{points:{increment:amount}}
        })

        res.json("transfer poin berhasil")
    })
  } catch (error) {
    res.status(500). json ("internal server error")
  }
};


export const userPoints = async (req: Request, res: Response, next: any) => {
try {
     const userId = Number (req.params.id)
    const userPoints = await prisma.user.findUnique({
        where:{id:userId},
        select:{
            id:true,
            points: true,
        },
    });

    res.status(200).json({message: "data ditemukan", data:userPoints});
} catch (error) {
    next(error);
}
};
   