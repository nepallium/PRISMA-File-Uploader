import prisma from "../config/prisma.js";

export async function createUser(formData) {
  const user = prisma.user.create({
    data: formData,
  });

  return user;
}

export async function isEmailAvailable(value) {
  const count = await prisma.user.count({
    where: { email: value },
  });

  if (count > 0) {
    throw Error;
  }

  return true;
}

export async function getAllFolders() {
  const folders = await prisma.folder.findMany({
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });

  return folders;
}

export async function getOneFolder(data) {
  let folder;

  if (data.folderName === "/") {
    folder = await prisma.folder.upsert({
      where: {
        ownerId_folderName: {
          ownerId: data.ownerId,
          folderName: data.folderName,
        },
      },
      update: {},
      create: {
        ownerId: data.ownerId,
        folderName: data.folderName,
        priority: 1,
      },
    });
  } else {
    folder = await prisma.folder.findFirst({
      where: {
        ownerId: data.ownerId,
        folderName: data.folderName,
      },
    });
  }

  return folder;
}

export async function createFolder(data) {
  const folder = await prisma.folder.create({
    data: {
      folderName: data.folderName,
      ownerId: data.ownerId,
    },
  });
}

export async function deleteFolder(folderId) {
  await prisma.folder.delete({
    where: {
      folderId,
    },
  });
}

export async function updateFolder(folderId, newName) {
  const updated = await prisma.folder.update({
    where: { folderId },
    data: { folderName: newName },
  });

  return updated;
}
