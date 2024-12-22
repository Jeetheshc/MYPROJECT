// import multer from 'multer'

// const storage = multer.diskStorage({
//     filename: function (req, file, cb) {
     
//         // console.log(file,"===============file");
//       cb(null, file.originalname )
//     }
//   })
  
//  export const upload = multer({ storage: storage })
import multer from 'multer';

const storage = multer.memoryStorage(); // Store file in memory buffer
export const upload = multer({ storage });
