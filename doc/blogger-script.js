fetch('https://blogger-project-vert.vercel.app/api')
    .then(response => response.json())
    .then(data => {
        console.log(data); // 在前端处理数据
        document.getElementById('test').textContent = data;
    })
    .catch(error => console.error('Error:', error));
