import prisma from "../config/prisma.js";

export async function createUser(formData) {
  const user = prisma.user.create({
    data: formData
  })

  return user
}

export async function isEmailAvailable(value) {
  const count = await prisma.user.count({
    where: {email: value}
  })

  if (count > 0) {
    throw Error;
  }

  return true
}

export async function createFolder(data) {
  const folder = await prisma.folder.create({
        data: {
            folderName: data.folderName,
            ownerId: data.ownerId
        }
    })
}