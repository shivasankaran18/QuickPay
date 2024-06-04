
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@repo/db/client";
import zod from "zod";

const email=zod.string().email();

export const authOptions = {
    providers: [
      CredentialsProvider({
          name: 'Credentials',
          credentials: {
            email: { label: "Email", type: "text", placeholder:"shiva@gmail.com", required: true },
            password: { label: "Password", type: "password", required: true }
          },
          async authorize(credentials: any) {
            const res=email.safeParse(credentials.email)
            console.log(res);
            if(!res.success)
            {
                return null;
            }
            
            const hashedPassword = await bcrypt.hash(credentials.password, 10);
            const existingUser = await prisma.user.findFirst({
                where: {
                    email: credentials.email
                }
            });

            if (existingUser) {
                const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                if (passwordValidation) {
                    return {
                        id: existingUser.id.toString(),
                        name: existingUser.name,
                        email: existingUser.email
                    }
                }
                return null;
            }

            try {
                const user = await prisma.user.create({
                    data: {
                        email: credentials.email,
                        password: hashedPassword,
                        
                    }
                });
                const balance=await prisma.balance.create({
                  data:{
                      userId:user.id,
                      amount:0,
                      locked:0

                  }
                })
            
                return {
                    id: user.id.toString(),
                    name: user.name,
                    email: user.email
                }
            } catch(e) {
                console.error(e);
            }

            return null
          },
        }),
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID || "",
            clientSecret: process.env.AUTH_GOOGLE_SECRET || ""
          })
    ],
    secret: process.env.JWT_SECRET || "secret",
    callbacks: {
       async signIn({user,account,profile}:{user:any,account:any,profile:any}){
            const res =await prisma.user.findUnique({
                where:{
                  email:user.email as string
                }
              })
              if(res)
              {
                user.id=res.id;
               
                  return true;
              }
              const temp=await prisma.user.create({
                data:{
                  email:user.email as string,
                  name:user.name,

              
        
                },
                select:{
                  email:true,
                  id:true
        
                }
              })
              const balance=await prisma.balance.create({
                data:{
                    userId:temp.id,
                    amount:0,
                    locked:0

                }
              })
              
              user.id=temp.id;

             
              return true

        },
        async session({ token, session }: any) {
        
            session.user.id = token.sub
           
            return session
        }
    },

  }
  