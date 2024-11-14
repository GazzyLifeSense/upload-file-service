const express = require('express');
const multer  = require('multer');
const path = require('path');
const fs = require('fs')
const os = require('os');
 
const username = os.userInfo().username;
const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './');
    }
});

const upload = multer({ storage: storage });
app.post('/upload', upload.single('file'), (req, res) => {
    const filePath = req.file.path;
    const fileName = Buffer.from(req.file.originalname, "latin1").toString("utf8");
    const destPath = path.join(`C:/Users/${username}/Desktop`, fileName);

    fs.rename(filePath, destPath, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        console.log(`[File]: ${fileName} - SaveTo${destPath}`);
        res.send('File uploaded successfully!');
    });
});

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>

<head>
    <title>File Upload Example</title>
</head>

<body>
    <input type="file" id="fileInput">
    <button onclick="uploadFile()">Upload File</button>

    <script>
        function uploadFile() {
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);

            fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formData,
            })
                .then(response => response.text())
                .then(data => {
                    alert(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    </script>
</body>

</html>`)
})

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});