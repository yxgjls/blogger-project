fetch('https://your-vercel-project.vercel.app/api')
    .then(response => response.json())
    .then(data => {
        console.log(data); // 在前端处理数据
    })
    .catch(error => console.error('Error:', error));
