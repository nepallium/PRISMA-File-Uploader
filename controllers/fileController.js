import multer from "multer";
const upload = multer({dest: "uploads/"})

export const uploadFile = [
    upload.single('uploadedFile'),
    async function (req, res, next) {
        res.redirect("/")
    }
]