// DOM элементүүдийг авах
const emailForm = document.getElementById('emailForm');
const passwordForm = document.getElementById('passwordForm');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const userNameSpan = document.getElementById('userName');
const alertMessage = document.getElementById('alertMessage');
const alertText = document.getElementById('alertText');
const loader = document.getElementById('loader');

let currentUser = null;

// Санамсаргүй токен үүсгэх функц
function generateToken(length = 16) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}

// Мэдэгдэл харуулах функц
function showAlert(message, type = 'error') {
  alertText.textContent = message;

  // Одоогийн классуудыг арилгах
  alertMessage.classList.remove(
    'bg-green-100', 'border-green-400', 'text-green-700',
    'bg-red-100', 'border-red-400', 'text-red-700',
    'bg-blue-100', 'border-blue-400', 'text-blue-700'
  );

  // Мэдэгдлийн төрлөөс хамаарч классуудыг нэмэх
  if (type === 'success') {
    alertMessage.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
  } else if (type === 'error') {
    alertMessage.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
  } else if (type === 'info') {
    alertMessage.classList.add('bg-blue-100', 'border-blue-400', 'text-blue-700');
  }

  // Мэдэгдлийг харуулах
  alertMessage.classList.remove('hidden');

  // 5 секундын дараа автоматаар нуух
  setTimeout(hideAlert, 5000);
}

// Мэдэгдэл нуух функц
function hideAlert() {
  alertMessage.classList.add('hidden');
}

let usersData = [];

// Secure code
const secureCode = "A1b2C3d4E5f6G7h8I9j0KlmNOPqrSTUVwXyZ";

// Google Exec линкээс өгөгдөл татаж авах
fetch(`https://script.google.com/macros/s/AKfycbzXWoDO2IctIuUjC9Uj7mewm_ygkgSeS2wUYKo2NAtcQZzwIhYnUrps9lMPmBEKkq0jMQ/exec?key=${secureCode}`)
  .then(response => response.json())
  .then(data => {
    // Өгөгдлийг usersData-д оноох
    usersData = data.Users;

    // Хэрэглэгчийг имэйл эсвэл утасны дугаараар олох функц
    function findUser(identifier) {
      return usersData.find(user => 
        user.email.toLowerCase() === identifier.toLowerCase() || 
        String(user.phone) === identifier
      );
    }

    // Имэйл/утасны дугаарын формын илгээх үйлдэлд сонсогч нэмэх
    emailForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const identifierInput = document.getElementById('identifier').value.trim();

      // Оролтын шалгалт
      if (!identifierInput) {
        showAlert('Имэйл эсвэл утасны дугаараа оруулна уу.', 'error');
        return;
      }

      // Ачааллын дүрсийг харуулах
      loader.classList.remove('hidden');

      // Хэрэглэгчийг олох
      currentUser = findUser(identifierInput);

      if (currentUser) {
        // Нууц үг оруулах алхам руу шилжих
        setTimeout(() => {
          loader.classList.add('hidden');
          step1.classList.add('hidden');
          step2.classList.remove('hidden');
          userNameSpan.textContent = currentUser.name;
        }, 1000); // Ачаалах хугацааг симуляц хийх
      } else {
        // Хэрэглэгч олдоогүй тохиолдолд алдаа харуулах
        setTimeout(() => {
          loader.classList.add('hidden');
          showAlert('Хэрэглэгч олдсонгүй. Имэйл эсвэл утасны дугаараа шалгана уу.', 'error');
        }, 1000); // Ачаалах хугацааг симуляц хийх
      }
    });

    // Нууц үгийн формын илгээх үйлдэлд сонсогч нэмэх
    passwordForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const enteredPassword = document.getElementById('password').value.trim();

      // Нууц үгийн шалгалт
      if (!enteredPassword) {
        showAlert('Нууц үгээ оруулна уу.', 'error');
        return;
      }

      // Ачааллын дүрсийг харуулах
      loader.classList.remove('hidden');

      // Нууц үгийг шалгах
      setTimeout(() => {
        loader.classList.add('hidden');
        if (enteredPassword === String(currentUser.password)) {
          // Санамсаргүй токен үүсгэх
          const token = generateToken();

          // Хэрэглэгчийн имэйл болон токеныг sessionStorage-д хадгалах
          sessionStorage.setItem("currentUserEmail", currentUser.email);
          sessionStorage.setItem("authToken", token);

          // Хувийн мэдээллийг sessionStorage-д шинэчлэх
          const profileData = {
            userId: currentUser.userId,
            name: currentUser.name,
            email: currentUser.email,
            role: currentUser.role,
            phone: currentUser.phone,
            availability: currentUser.availability
          };
          sessionStorage.setItem('profileData', JSON.stringify(profileData));

          // Амжилтын мэдэгдэл харуулах болон зохих хуудас руу шилжүүлэх
          showAlert(`Нэвтрэх амжилттай боллоо! Сайн уу, ${currentUser.name}.`, 'success');
          setTimeout(() => {
            // Хэрэглэгчийн дүрийг шалгаж, зохих хуудас руу шилжүүлэх
            if (currentUser.role === 'Admin' || currentUser.role === 'Manager' || currentUser.role === 'Driver' || currentUser.role === 'Guide') {
              // Параметрүүдийг дарааллаар нь дамжуулах (id, role, securelink)
              window.location.href = `newdash2.html?${currentUser.userId}&${currentUser.role}&${token}`;
            } else {
              window.location.href = 'userDashboard.html';
            }
          }, 2000);
        } else {
          // Нууц үг буруу тохиолдолд алдаа харуулах
          showAlert('Нууц үг буруу байна. Дахин оролдоно уу.', 'error');
        }
      }, 1000); // Ачаалах хугацааг симуляц хийх
    });

  })
  .catch(error => {
    console.error('Өгөгдөл татахад алдаа гарлаа:', error);
    showAlert('Алдаа гарлаа. Дахин оролдоно уу.', 'error');
  });
