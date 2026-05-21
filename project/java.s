// 1. Tạo một biến để đếm số lượng hàng (bắt đầu từ số 0)
let soLuong = 0;

// 2. Tìm cái số 0 trên màn hình bằng ID của nó
const textGioHang = document.getElementById("cart-count");

// 3. Lấy tất cả các nút "Mua ngay" có trên trang web
const danhSachNutMua = document.querySelectorAll(".add-to-cart");

// 4. Dùng vòng lặp để cài đặt sự kiện cho từng cái nút một
danhSachNutMua.forEach(function(nut) {
    
    // Khi có ai đó "click" vào nút này
    nut.addEventListener("click", function() {
        
        // Tăng biến đếm lên 1 đơn vị
        soLuong = soLuong + 1;
        
        // Thay số lượng mới vào màn hình
        textGioHang.textContent = soLuong;
        
        // Bật một thông báo nhỏ cho người dùng biết
        alert("Đã thêm sản phẩm vào giỏ hàng!");
    });
    
});