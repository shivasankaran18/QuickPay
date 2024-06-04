
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
            name:{label:"Org Name",type:"text",placeholder:"OrgName",required:true},
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
            const existingmerchant = await prisma.merchant.findFirst({
                where: {
                    email: credentials.email
                }
            });
            console.log("existing")

            if (existingmerchant) {
                const passwordValidation = await bcrypt.compare(credentials.password, existingmerchant.password ||"");
                if (passwordValidation) {
                    return {
                        id: existingmerchant.id.toString(),
                        name: existingmerchant.name,
                        email: existingmerchant.email
                    }
                }
                return null;
            }

            try {
                const user = await prisma.merchant.create({
                    data: {
                        email: credentials.email,
                        password: hashedPassword,
                        name:credentials.name,
                        mer_amount:0

                        
                    }
                });
               
            
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
            const res =await prisma.merchant.findUnique({
                where:{
                  email:user.email as string
                }
              })
              if(res)
              {
                user.id=res.id;
                console.log(user)
               
                  return true;
              }
              const temp=await prisma.merchant.create({
                data:{
                  email:user.email as string,
                  name:user.name,
                  mer_amount:0

              
        
                },
                select:{
                  email:true,
                  id:true
        
                }
              })

              
              user.id=temp.id;
              console.log(user)

             
              return true

        },
        async session({ token, session }: any) {
        
            session.user.id = token.sub
            console.log(session)
           
            return session
        }
    },

  }
  