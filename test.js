
window.addEventListener('scroll', function () {
    var sidebar = document.querySelector('.side-bar-fixed');
    var scrollY = window.scrollY || window.pageYOffset;
    var breakpoint = 150; // Change this value as needed

    if (scrollY > breakpoint) {
        sidebar.classList.add('sticky');
    } else {
        sidebar.classList.remove('sticky');
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;

    // Thêm sự kiện click cho nút chuyển đổi
    darkModeToggle.addEventListener("click", function () {
        // Kiểm tra nếu đang ở chế độ tối
        if (body.classList.contains("dark-mode")) {
            // Chuyển sang chế độ sáng
            body.classList.remove("dark-mode");
            body.classList.add("white-mode");
        } else {
            // Chuyển sang chế độ tối
            body.classList.remove("white-mode");
            body.classList.add("dark-mode");
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    var backToTopButton = document.querySelector(".back-to-top");

    window.addEventListener("scroll", function () {
        if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
            backToTopButton.classList.add("show");
        } else {
            backToTopButton.classList.remove("show");
        }
    });

    backToTopButton.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});
