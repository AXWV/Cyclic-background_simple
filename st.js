const background = document.getElementById('background');
let x = 0;
let y = 0;
let isUserControl = false; // 是否处于用户控制模式
let userDirection = { x: 0, y: 0 }; // 用户控制方向
let speed = 1; // 默认速度
let randomDirection = { x: 0, y: 0 }; // 随机移动方向
let isRandomMove = false; // 是否处于随机移动模式
let isMoving = false; // 是否正在移动
let scale = 1; // 默认缩放比例

// 获取提示框
const status = document.getElementById('status');
const currentDirection = document.getElementById('currentDirection');
const currentSpeed = document.getElementById('currentSpeed');

// 获取双击菜单
const menu = document.getElementById('menu');

// 随机移动（仅一个方向）
function randomMove() {
    const randomX = Math.random() > 0.5 ? 1 : -1; // 随机选择水平方向
    const randomY = Math.random() > 0.5 ? 1 : -1; // 随机选择垂直方向
    randomDirection = { x: randomX, y: randomY };
    isRandomMove = true;
    isMoving = true; // 设置为正在移动
    updateStatus();
    updateDirectionButtons();
}

// 取消移动
function cancelMove() {
    isRandomMove = false;
    userDirection = { x: 0, y: 0 };
    isMoving = false; // 设置为未移动
    updateStatus();
    updateDirectionButtons();
}

// 更新移动状态显示
function updateStatus() {
    let directionText = '停';
    if (isRandomMove) {
        directionText = `随机(${randomDirection.x}, ${randomDirection.y})`;
    } else if (userDirection.x !== 0 || userDirection.y !== 0) {
        directionText = getDirectionText(userDirection.x, userDirection.y);
    }
    currentDirection.textContent = directionText;
    currentSpeed.textContent = speed.toFixed(1);

    if (isMoving) {
        status.style.opacity = 1;
        status.style.transform = 'translateX(0)';
    } else {
        setTimeout(() => {
            status.style.opacity = 0;
            status.style.transform = 'translateX(-100%)';
        }, 500);
    }
}

// 获取方向文本
function getDirectionText(x, y) {
    if (x === 0 && y === -1) return '上';
    if (x === 0 && y === 1) return '下';
    if (x === -1 && y === 0) return '左';
    if (x === 1 && y === 0) return '右';
    if (x === -1 && y === -1) return '左上';
    if (x === 1 && y === -1) return '右上';
    if (x === -1 && y === 1) return '左下';
    if (x === 1 && y === 1) return '右下';
    return '停';
}

// 更新方向按钮的样式
function updateDirectionButtons() {
    const directionButtons = document.querySelectorAll('.direction-btn');
    directionButtons.forEach(button => button.classList.remove('active'));
    if (userDirection.x === 0 && userDirection.y === 0) return; // 如果是停止状态，不设置活动按钮
    const activeButton = document.querySelector(`.direction-btn[onclick*="${userDirection.x},${userDirection.y}"]`);
    if (activeButton) activeButton.classList.add('active');
}

// 随机自动移动背景图片
function moveBackground() {
    if (isRandomMove) {
        x += randomDirection.x * speed;
        y += randomDirection.y * speed;
    } else if (isUserControl) {
        // 用户控制移动
        x += userDirection.x * speed;
        y += userDirection.y * speed;
    }
    background.style.backgroundPosition = `${-x}px ${-y}px`;
    background.style.backgroundSize = `${scale * 100}%`; // 动态调整背景图片的缩放比例
    requestAnimationFrame(moveBackground);
}

// 用户控制移动背景图片
document.addEventListener('keydown', (event) => {
    const key = event.key;
    switch (key) {
        case 'ArrowUp':
            userDirection.y = -1;
            break;
        case 'ArrowDown':
            userDirection.y = 1;
            break;
        case 'ArrowLeft':
            userDirection.x = -1;
            break;
        case 'ArrowRight':
            userDirection.x = 1;
            break;
    }
    isUserControl = true; // 启用用户控制模式
    isRandomMove = false; // 取消随机移动模式
    isMoving = true; // 设置为正在移动
    updateStatus();
    updateDirectionButtons();
});

document.addEventListener('keyup', () => {
    userDirection.x = 0;
    userDirection.y = 0;
    isUserControl = false; // 禁用用户控制模式
    isMoving = false; // 设置为未移动
    updateStatus();
    updateDirectionButtons();
});

// 设置移动方向
function setDirection(dx, dy) {
    userDirection.x = dx;
    userDirection.y = dy;
    isUserControl = true; // 启用用户控制模式
    isRandomMove = false; // 取消随机移动模式
    isMoving = true; // 设置为正在移动
    updateStatus();
    updateDirectionButtons();
}

// 双击显示菜单
document.addEventListener('dblclick', () => {
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    isMoving = false; // 设置为未移动
    updateStatus();
});

// 获取速度
document.getElementById('speed').addEventListener('input', (e) => {
    speed = parseFloat(e.target.value);
    document.getElementById('speedInput').value = speed;
    updateStatus();
});

document.getElementById('speedInput').addEventListener('input', (e) => {
    speed = parseFloat(e.target.value);
    document.getElementById('speed').value = speed;
    updateStatus();
});

// 处理自定义图片上传
document.getElementById('customImage').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            background.style.backgroundImage = `url(${imageUrl})`;
            background.style.backgroundSize = `${scale * 100}%`; // 设置初始缩放比例
            background.style.backgroundRepeat = 'no-repeat'; // 避免平铺
            background.style.backgroundPosition = 'center'; // 居中显示
        };
        reader.readAsDataURL(file);
    }
});

// 设置自定义图片URL
function setCustomImageUrl() {
    const imageUrl = document.getElementById('imageUrl').value;
    background.style.backgroundImage = `url(${imageUrl})`;
    background.style.backgroundSize = `${scale * 100}%`; // 设置初始缩放比例
    background.style.backgroundRepeat = 'no-repeat'; // 避免平铺
    background.style.backgroundPosition = 'center'; // 居中显示
}

// 打开在线图片库
function openTextureLibrary() {
    const textureLibrary = document.getElementById('textureLibrary');
    textureLibrary.style.display = textureLibrary.style.display === 'none' ? 'block' : 'none';
}

// 添加缩放功能
document.getElementById('scale').addEventListener('input', (e) => {
    scale = parseFloat(e.target.value);
    background.style.backgroundSize = `${scale * 100}%`; // 动态调整背景图片的缩放比例
});

// 启动自动移动
moveBackground();
