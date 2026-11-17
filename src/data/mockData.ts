import {
  Product,
  QuizAnswers,
  QuizGoal,
  QuizMatchResult,
  SmartLockerLocation,
} from '../types';

export const DEFAULT_COURIER_HINT = '';
export const COURIER_HINT_PLACEHOLDER =
  'VD: Bàn bảo vệ KTX Khu B · Biệt danh: Mèo Béo';

export const formatVnd = (amount: number): string => {
  return `${amount.toLocaleString('vi-VN').replace(/,/g, '.')}đ`;
};

export const PRODUCTS: Product[] = [
  // ===================== BAO CAO SU =====================
  {
    id: 'durex-invisible',
    name: 'Durex Invisible Siêu Mỏng',
    shortName: 'Durex Invisible',
    packSize: 'Hộp 10 chiếc',
    priceVnd: 215000,
    pharmacyPartner: 'Xuất kho Q.10',
    district: 'Quận 10',
    mohLicenseNo: 'MOH-HCMC-4419',
    batchNo: 'DX26-0891',
    expiryDate: 'HSD 08/2028',
    category: 'condom',
    nominalWidth: '52mm Tiêu chuẩn',
    shortWidth: '52mm',
    thickness: '0.04mm Siêu mỏng',
    shortThickness: '0.04mm',
    material: 'Cao su thiên nhiên',
    shortMaterial: 'Latex y tế',
    shortExpiry: '08/2028',
    lubricant: 'Silicone mịn không mùi',
    highlightBadge: '52mm • Siêu mỏng 0.04',
    keyIngredients: [
      'Mủ cao su thiên nhiên chuẩn y tế',
      'Chất bôi trơn Dimethicone tinh khiết, không mùi',
      'Không paraben, không chất gây kích ứng',
    ],
    summary:
      'Siêu mỏng 0.04mm cho cảm giác chân thật, giữ trọn độ an toàn chuẩn Bộ Y tế và đóng vỉ bạc mờ kín đáo.',
    usageGuide:
      'Bóp nhẹ đầu núm để đẩy hết khí trước khi mang, cuộn đều từ đầu xuống gốc trước khi tiếp xúc.',
    safetyWarning:
      'Chỉ dùng 1 lần/chiếc. Không dùng chung với dầu ăn, vaseline hoặc gel gốc dầu vì có thể làm rách cao su.',
    fitTags: ['ultra-thin', 'natural-feel', 'mid-range', 'standard-fit'],
    accentTone: 'teal',
    reviews: [
      {
        id: 'rev-1',
        author: 'Khách ẩn danh',
        district: 'Quận 10',
        rating: 5,
        comment:
          'Hộp bọc siêu kín, seal còn nguyên. Ghé tủ Smart Locker gần Bách Khoa lấy mất chưa tới 30s.',
        verifiedDate: '2 ngày trước',
      },
      {
        id: 'rev-2',
        author: 'Khách ẩn danh',
        district: 'Quận 5',
        rating: 5,
        comment:
          'Không bị mùi cao su gắt, kiểm tra mã lô chuẩn nhà thuốc. Đỡ ngại hẳn so với ra tiệm.',
        verifiedDate: '1 tuần trước',
      },
    ],
  },
  {
    id: 'sagami-001',
    name: 'Sagami Original 0.01',
    shortName: 'Sagami Original 0.01',
    packSize: 'Hộp 5 chiếc',
    priceVnd: 290000,
    pharmacyPartner: 'Xuất kho Q.1',
    district: 'Quận 1',
    mohLicenseNo: 'MOH-HCMC-1082',
    batchNo: 'SG26-4120',
    expiryDate: 'HSD 11/2028',
    category: 'condom',
    nominalWidth: '55mm Thoải mái',
    shortWidth: '55mm',
    thickness: '0.01mm Cực mỏng',
    shortThickness: '0.01mm',
    material: 'Polyurethane (Không Latex)',
    shortMaterial: 'Không Latex',
    shortExpiry: '11/2028',
    lubricant: 'Gel silicon êm không mùi',
    highlightBadge: '55mm • 0.01 • Không Latex',
    keyIngredients: [
      'Polyurethane sinh học chuẩn Nhật (100% không Latex)',
      'Không protein cao su — an toàn cho cơ địa dị ứng',
      'Truyền nhiệt nhanh, hoàn toàn không mùi',
    ],
    summary:
      'Dòng 0.01mm chuẩn Nhật cho người dị ứng latex: truyền nhiệt tức thì, siêu bền và hoàn toàn không mùi cao su.',
    usageGuide:
      'Mở vỉ hộp bơ theo hướng mũi tên, kiểm tra mặt cuộn thuận chiều trước khi đeo; có thể dùng kèm gel gốc nước.',
    safetyWarning:
      'Chất liệu Polyurethane chịu lực tốt nhưng không co giãn nhiều như Latex, ưu tiên chọn đúng size 55mm để đeo êm.',
    fitTags: ['latex-free', 'ultra-thin', 'premium', 'extra-safety'],
    accentTone: 'slate',
    reviews: [
      {
        id: 'rev-3',
        author: 'Khách ẩn danh',
        district: 'Quận 1',
        rating: 5,
        comment:
          'Không kích ứng latex và không mùi cao su. Vỉ đóng kiểu hộp bơ sạch sẽ, kín đáo.',
        verifiedDate: '3 ngày trước',
      },
      {
        id: 'rev-4',
        author: 'Khách ẩn danh',
        district: 'Bình Thạnh',
        rating: 5,
        comment:
          'Sao kê ví chỉ hiện HCMC DAILY WELLNESS. Giao tới nơi nguyên tem nhập khẩu.',
        verifiedDate: '6 ngày trước',
      },
    ],
  },
  {
    id: 'okamoto-003-ha',
    name: 'Okamoto 0.03 Hyaluronic',
    shortName: 'Okamoto 0.03 HA',
    packSize: 'Hộp 10 chiếc',
    priceVnd: 185000,
    pharmacyPartner: 'Xuất kho Q.3',
    district: 'Quận 3',
    mohLicenseNo: 'MOH-HCMC-3174',
    batchNo: 'OK26-7734',
    expiryDate: 'HSD 05/2028',
    category: 'condom',
    nominalWidth: '52mm Tiêu chuẩn',
    shortWidth: '52mm',
    thickness: '0.03mm Siêu mỏng',
    shortThickness: '0.03mm',
    material: 'Cao su thiên nhiên mỏng',
    shortMaterial: 'Latex + HA',
    shortExpiry: '05/2028',
    lubricant: 'Cấp ẩm Hyaluronic Acid',
    highlightBadge: '52mm • Cấp ẩm HA êm mượt',
    keyIngredients: [
      'Tinh chất dưỡng ẩm Hyaluronic Acid dịu nhẹ',
      'Nền nước tinh khiết, rửa sạch nhanh',
      'Cao su siêu mỏng đã kiểm nghiệm da liễu',
    ],
    summary:
      'Phủ sẵn Hyaluronic Acid giúp cấp ẩm mượt mà, giảm ma sát cực êm với mức giá dễ chịu cho sinh viên.',
    usageGuide:
      'Lượng gel HA đã phủ sẵn đều khắp thân bao; giữ mép bao khi rút ra sau xuất tinh để tránh tràn.',
    safetyWarning:
      'Không sử dụng nếu hộp có dấu hiệu hở niêm phong hoặc bạn có tiền sử dị ứng mủ cao su tự nhiên.',
    fitTags: ['comfort', 'extra-lubrication', 'student-budget', 'sensitive', 'ultra-thin'],
    accentTone: 'sage',
    reviews: [
      {
        id: 'rev-5',
        author: 'Khách ẩn danh',
        district: 'Quận 3',
        rating: 5,
        comment:
          'Êm và ẩm mượt, không bị bết rít. Hộp 10 cái tầm giá này rất ổn cho sinh viên.',
        verifiedDate: 'Hôm qua',
      },
      {
        id: 'rev-6',
        author: 'Khách ẩn danh',
        district: 'Thủ Đức',
        rating: 5,
        comment:
          '10 giờ tối ghé tủ KTX Khu B lấy hàng gọn ơ, không gặp ai mà tem Okamoto chuẩn xịn.',
        verifiedDate: '5 ngày trước',
      },
    ],
  },
  {
    id: 'okamoto-harmony',
    name: 'Okamoto Harmony Vibra',
    shortName: 'Okamoto Harmony',
    packSize: 'Hộp 10 chiếc',
    priceVnd: 165000,
    pharmacyPartner: 'Xuất kho Q.3',
    district: 'Quận 3',
    mohLicenseNo: 'MOH-HCMC-5120',
    batchNo: 'OH26-3391',
    expiryDate: 'HSD 07/2028',
    category: 'condom',
    nominalWidth: '49mm Ôm sát',
    shortWidth: '49mm',
    thickness: '0.04mm Ôm khít',
    shortThickness: '0.04mm',
    material: 'Cao su thiên nhiên Nhật',
    shortMaterial: 'Latex Nhật',
    shortExpiry: '07/2028',
    lubricant: 'Gel trơn dịu nhẹ có rãnh gân',
    highlightBadge: '49mm • Ôm sát vừa vặn',
    keyIngredients: [
      'Thiết kế size nhỏ 49mm chống tuột hiệu quả',
      'Gân nổi nhẹ tăng cảm giác nhưng vẫn êm ái',
      'Chất bôi trơn dịu nhẹ không mùi hắc',
    ],
    summary:
      'Thiết kế cỡ nhỏ 49mm ôm sát vừa vặn cho người Việt, giúp tự tin chắc chắn và hoàn toàn không bị lỏng tuột.',
    usageGuide:
      'Phù hợp chu vi dưới 10cm. Cuộn sát xuống gốc dương vật để cố định chắc chắn suốt quá trình.',
    safetyWarning:
      'Nếu thấy vòng gốc quá chặt gây tê hoặc hằn đỏ, nên chuyển sang size tiêu chuẩn 52mm.',
    fitTags: ['snug-49', 'student-budget', 'ultra-thin'],
    accentTone: 'sage',
    reviews: [
      {
        id: 'rev-9',
        author: 'Khách ẩn danh',
        district: 'Quận 3',
        rating: 5,
        comment:
          'Cuối cùng cũng tìm được dòng 49mm vừa khít, không bị dư đầu hay tuột như mấy loại 52mm ngoài tiệm.',
        verifiedDate: '3 ngày trước',
      },
    ],
  },
  {
    id: 'sagami-002-large',
    name: 'Sagami Original 0.02 Large',
    shortName: 'Sagami 0.02 Large',
    packSize: 'Hộp 6 chiếc',
    priceVnd: 275000,
    pharmacyPartner: 'Xuất kho Q.1',
    district: 'Quận 1',
    mohLicenseNo: 'MOH-HCMC-2045',
    batchNo: 'SL26-6612',
    expiryDate: 'HSD 12/2028',
    category: 'condom',
    nominalWidth: '55mm Size lớn',
    shortWidth: '55mm',
    thickness: '0.02mm Siêu mỏng',
    shortThickness: '0.02mm',
    material: 'Polyurethane (Không Latex)',
    shortMaterial: 'Không Latex',
    shortExpiry: '12/2028',
    lubricant: 'Gel silicon y tế mịn màng',
    highlightBadge: '55mm • Size lớn / Không Latex',
    keyIngredients: [
      'Độ rộng 55mm rộng rãi, giảm cảm giác bó chặt',
      '100% Polyurethane không chứa Latex chống dị ứng',
      'Siêu mỏng 0.02mm truyền nhiệt tức thì, không mùi',
    ],
    summary:
      'Phiên bản cỡ lớn 55mm bằng Polyurethane không Latex chuẩn Nhật, rộng rãi thoải mái và an toàn tuyệt đối cho da nhạy cảm.',
    usageGuide:
      'Dành cho chu vi trên 11cm. Bảo quản nơi thoáng mát, tránh để trong ví da lâu ngày dưới nắng nóng.',
    safetyWarning:
      'Không xé vỏ bằng vật sắc nhọn hoặc móng tay dài; sử dụng 1 chiếc mới cho mỗi lần quan hệ.',
    fitTags: ['large-55', 'latex-free', 'ultra-thin', 'premium'],
    accentTone: 'slate',
    reviews: [
      {
        id: 'rev-10',
        author: 'Khách ẩn danh',
        district: 'Bình Thạnh',
        rating: 5,
        comment:
          'Đeo dòng phổ thông hay bị hằn đau, đổi qua bản Large 55mm thoải mái hẳn mà lại không dị ứng mùi cao su.',
        verifiedDate: '5 ngày trước',
      },
    ],
  },
  {
    id: 'durex-jeans',
    name: 'Durex Jeans',
    shortName: 'Durex Jeans',
    packSize: 'Hộp 12 chiếc',
    priceVnd: 135000,
    pharmacyPartner: 'Xuất kho Thủ Đức',
    district: 'Thủ Đức',
    mohLicenseNo: 'MOH-HCMC-6398',
    batchNo: 'DJ26-1904',
    expiryDate: 'HSD 10/2028',
    category: 'condom',
    nominalWidth: '52.5mm Easy-On',
    shortWidth: '52.5mm',
    thickness: '0.05mm Bền chắc',
    shortThickness: '0.05mm',
    material: 'Cao su thiên nhiên',
    shortMaterial: 'Latex Easy-On',
    shortExpiry: '10/2028',
    lubricant: 'Silicone mượt dễ mang',
    highlightBadge: '52.5mm • Dễ đeo • Giá tiết kiệm',
    keyIngredients: [
      'Dáng Easy-On dễ đeo trong 5 giây cho người mới',
      'Thêm lượng gel bôi trơn giúp giảm ma sát',
      'Hộp 12 chiếc tiết kiệm, kiểm định điện tử 100%',
    ],
    summary:
      'Thiết kế Easy-On dễ đeo cho người mới bắt đầu, nhiều gel mượt mà cùng mức giá tiết kiệm nhất cho sinh viên.',
    usageGuide:
      'Nếu đặt sai mặt bao không cuộn xuống được, hãy bỏ đi và dùng chiếc mới để tránh dính dịch tiền xuất tinh.',
    safetyWarning:
      'Sản phẩm chứa mủ cao su thiên nhiên; ngưng dùng ngay nếu có dấu hiệu kích ứng hoặc mẩn đỏ.',
    fitTags: ['beginner', 'standard-52', 'student-budget'],
    accentTone: 'teal',
    reviews: [
      {
        id: 'rev-11',
        author: 'Khách ẩn danh',
        district: 'Thủ Đức',
        rating: 5,
        comment:
          'Dễ đeo cực kỳ cho người mới, giá hộp 12 cái rất kinh tế. Nhận ở tủ KTX Khu B siêu kín.',
        verifiedDate: 'Hôm qua',
      },
    ],
  },
  {
    id: 'durex-pleasuremax',
    name: 'Durex Pleasuremax Gân & Gai',
    shortName: 'Durex Pleasuremax',
    packSize: 'Hộp 12 chiếc',
    priceVnd: 225000,
    pharmacyPartner: 'Xuất kho Q.10',
    district: 'Quận 10',
    mohLicenseNo: 'MOH-HCMC-4920',
    batchNo: 'DP26-5508',
    expiryDate: 'HSD 09/2028',
    category: 'condom',
    nominalWidth: '56mm Thoải mái',
    shortWidth: '56mm',
    thickness: 'Gân & Gai nổi',
    shortThickness: 'Gân + Gai',
    material: 'Cao su thiên nhiên',
    shortMaterial: 'Latex định hình',
    shortExpiry: '09/2028',
    lubricant: 'Silicone êm mượt giảm rát',
    highlightBadge: '56mm • Gân & Gai tăng kích thích',
    keyIngredients: [
      'Hệ thống đường gân + hạt gai nổi bố trí khoa học',
      'Dáng Easy-On 56mm rộng rãi dễ đeo, không bó chặt',
      'Sẵn gel silicone êm mượt hạn chế ma sát quá mức',
    ],
    summary:
      'Kết hợp đồng thời đường gân và hạt chấm nổi định vị chuẩn giúp tăng khoái cảm cho cả hai mà vẫn êm ái an toàn.',
    usageGuide:
      'Có thể nhỏ thêm 1–2 giọt gel bôi trơn gốc nước bên ngoài thân bao nếu bạn thích cảm giác lướt mượt hơn.',
    safetyWarning:
      'Chứa cao su thiên nhiên; nếu đối tác nhạy cảm hoặc đang khô rát, nên dùng thêm gel gốc nước đi kèm.',
    fitTags: ['ribbed-dotted', 'large-55', 'mid-range', 'pleasure'],
    accentTone: 'coral',
    reviews: [
      {
        id: 'rev-12',
        author: 'Khách ẩn danh',
        district: 'Quận 10',
        rating: 5,
        comment:
          'Hạt gai mịn vừa đủ kích thích chứ không bị rát. Size 56mm đeo rất thoải mái.',
        verifiedDate: '4 ngày trước',
      },
    ],
  },

  // ===================== THUỐC TRÁNH THAI =====================
  {
    id: 'postinor-1',
    name: 'Postinor 1 (Tránh thai khẩn cấp 72h)',
    shortName: 'Postinor 1 (72h)',
    packSize: 'Hộp 1 viên',
    priceVnd: 55000,
    pharmacyPartner: 'Nhà thuốc GPP Q.10',
    district: 'Quận 10',
    mohLicenseNo: 'VN-21673-24',
    batchNo: 'PT26-5041',
    expiryDate: 'HSD 10/2028',
    category: 'contraceptive',
    nominalWidth: 'Viên nén 1,5mg',
    shortWidth: 'Viên 1,5mg',
    thickness: 'Levonorgestrel',
    shortThickness: 'Levonorgestrel',
    material: 'Hiệu quả trong 72 giờ',
    shortMaterial: 'Trong 72 giờ',
    shortExpiry: '10/2028',
    lubricant: 'Hoạt chất Progestin đơn thuần',
    highlightBadge: 'Khẩn cấp 72h • 1 viên duy nhất',
    keyIngredients: [
      'Hoạt chất chính: Levonorgestrel 1,5 mg',
      'Cơ chế ức chế hoặc trì hoãn rụng trứng khẩn cấp',
      'Phân phối chính hãng từ nhà thuốc đạt chuẩn GPP',
    ],
    summary:
      'Thuốc tránh thai khẩn cấp 1 viên duy nhất chứa Levonorgestrel 1,5mg, dùng càng sớm càng tốt trong 72 giờ sau quan hệ không bảo vệ.',
    usageGuide:
      'Uống 1 viên càng sớm càng tốt (tốt nhất trong 12–24 giờ đầu, muộn nhất không quá 72 giờ) cùng nước lọc, không phụ thuộc bữa ăn.',
    safetyWarning:
      'Tác dụng phụ thường gặp: buồn nôn nhẹ, căng ngực, ra máu thấm giọt hoặc trễ kinh 3–7 ngày. Nếu nôn trong 2 giờ sau uống cần bổ sung liều mới theo tư vấn dược sĩ. Không lạm dụng quá 2 lần/tháng và không phòng ngừa bệnh lây truyền qua đường tình dục.',
    fitTags: ['emergency-72h', 'under-160', 'single-dose'],
    accentTone: 'coral',
    reviews: [
      {
        id: 'rev-13',
        author: 'Khách ẩn danh',
        district: 'Quận 10',
        rating: 5,
        comment:
          'Gặp sự cố rách bao lúc khuya, đặt nhận tủ Smart Locker 20 phút là uống kịp luôn, khỏi ngại ra nhà thuốc hỏi mua.',
        verifiedDate: '3 ngày trước',
      },
      {
        id: 'rev-14',
        author: 'Khách ẩn danh',
        district: 'Gò Vấp',
        rating: 5,
        comment:
          'Có đầy đủ hướng dẫn uống bù khi nôn và số đăng ký Bộ Y tế rõ ràng trên app nên rất yên tâm.',
        verifiedDate: '1 tuần trước',
      },
    ],
  },
  {
    id: 'ella-120h',
    name: 'Ella 30mg (Tránh thai khẩn cấp 120h)',
    shortName: 'Ella 30mg (120h)',
    packSize: 'Hộp 1 viên',
    priceVnd: 195000,
    pharmacyPartner: 'Nhà thuốc GPP Q.1',
    district: 'Quận 1',
    mohLicenseNo: 'VN-22940-24',
    batchNo: 'EL26-8812',
    expiryDate: 'HSD 06/2028',
    category: 'contraceptive',
    nominalWidth: 'Viên nén 30mg',
    shortWidth: 'Viên 30mg',
    thickness: 'Ulipristal acetate',
    shortThickness: 'Ulipristal 30mg',
    material: 'Hiệu quả đến 120 giờ',
    shortMaterial: 'Tối đa 120 giờ',
    shortExpiry: '06/2028',
    lubricant: 'Thế hệ mới chọn lọc Progesterone',
    highlightBadge: 'Thế hệ mới 120h • 1 viên',
    keyIngredients: [
      'Hoạt chất thế hệ mới: Ulipristal acetate 30 mg',
      'Duy trì hiệu quả ngay cả khi gần đỉnh rụng trứng LH',
      'Cửa sổ tác dụng kéo dài tới 120 giờ (5 ngày)',
    ],
    summary:
      'Thuốc tránh thai khẩn cấp thế hệ mới Ulipristal acetate 30mg giúp trì hoãn rụng trứng hiệu quả đến 120 giờ, ít lệ thuộc mốc 24h hơn dòng cũ.',
    usageGuide:
      'Uống 1 viên duy nhất càng sớm càng tốt trong vòng 120 giờ (5 ngày) sau quan hệ không an toàn; dùng bất kỳ thời điểm nào trong ngày.',
    safetyWarning:
      'Không uống lặp lại trong cùng một chu kỳ và không dùng đồng thời với thuốc khẩn cấp chứa Levonorgestrel. Nếu đang uống thuốc tránh thai hàng ngày, cần dùng kèm bao cao su đến hết chu kỳ; tránh cho con bú trong 7 ngày sau khi uống. Nếu trễ kinh >7 ngày, hãy thử thai.',
    fitTags: ['emergency-120h', 'mid-range', 'new-gen'],
    accentTone: 'slate',
    reviews: [
      {
        id: 'rev-15',
        author: 'Khách ẩn danh',
        district: 'Quận 1',
        rating: 5,
        comment:
          'Uống ở giờ thứ 40 vẫn hiệu quả ổn áp, không bị mệt nhiều. Đóng gói hộp carton trơn kín tuyệt đối.',
        verifiedDate: '2 ngày trước',
      },
    ],
  },
  {
    id: 'marvelon-28',
    name: 'Marvelon Vỉ 28 Viên (Hàng ngày)',
    shortName: 'Marvelon 28 viên',
    packSize: 'Hộp 1 vỉ 28 viên',
    priceVnd: 145000,
    pharmacyPartner: 'Nhà thuốc GPP Q.3',
    district: 'Quận 3',
    mohLicenseNo: 'VN-21405-24',
    batchNo: 'MV26-2910',
    expiryDate: 'HSD 09/2028',
    category: 'contraceptive',
    nominalWidth: 'Vỉ 28 viên (21+7)',
    shortWidth: 'Vỉ 28 viên',
    thickness: 'Desogestrel + EE',
    shortThickness: 'Desogestrel+EE',
    material: 'Bảo vệ đều 28 ngày',
    shortMaterial: 'Đều đặn 28 ngày',
    shortExpiry: '09/2028',
    lubricant: 'Liều thấp phối hợp thế hệ 3',
    highlightBadge: 'Hàng ngày vỉ 28 viên • Chủ động 99%',
    keyIngredients: [
      '21 viên trắng: Desogestrel 0,15mg + Ethinylestradiol 0,03mg',
      '7 viên xanh nhắc lịch không chứa nội tiết',
      'Hỗ trợ điều hòa chu kỳ kinh và giảm đau bụng kinh',
    ],
    summary:
      'Viên uống tránh thai hàng ngày liều thấp thế hệ 3 gồm 21 viên hoạt chất và 7 viên nhắc lịch giúp hình thành thói quen uống đúng giờ dễ dàng.',
    usageGuide:
      'Uống 1 viên/ngày vào cùng 1 khung giờ cố định (VD 21:00 tối) theo thứ tự mũi tên liên tục hết vỉ 28 viên rồi sang vỉ mới ngay, không nghỉ.',
    safetyWarning:
      'Nếu quên thuốc quá 12 giờ, cần uống bù ngay theo tờ hướng dẫn và dùng thêm bao cao su trong 7 ngày tiếp theo. Tháng đầu có thể gặp căng ngực, buồn nôn nhẹ hoặc ra máu rỉ rả. Chống chỉ định với người có tiền sử huyết khối tĩnh mạch, đau nửa đầu kèm aura, tăng huyết áp nặng hoặc đang mang thai.',
    fitTags: ['daily-28', 'under-160', 'proactive'],
    accentTone: 'sage',
    reviews: [
      {
        id: 'rev-16',
        author: 'Khách ẩn danh',
        district: 'Quận 3',
        rating: 5,
        comment:
          'Có 7 viên giả dược nhắc uống liên tục nên không sợ quên nhịp nghỉ vỉ. Giao kín cực kỳ lịch sự.',
        verifiedDate: '5 ngày trước',
      },
      {
        id: 'rev-17',
        author: 'Khách ẩn danh',
        district: 'Bình Thạnh',
        rating: 5,
        comment:
          'Date xa tận 2028, hàng chuẩn nhà thuốc GPP nên đặt định kỳ hàng tháng luôn.',
        verifiedDate: '1 tuần trước',
      },
    ],
  },

  // ===================== TĂNG KHOÁI CẢM & KÉO DÀI =====================
  {
    id: 'durex-intense-gel',
    name: 'Durex Intense Orgasmic Gel (Ấm/Mát)',
    shortName: 'Durex Intense Gel',
    packSize: 'Chai 10ml',
    priceVnd: 265000,
    pharmacyPartner: 'Xuất kho Q.1',
    district: 'Quận 1',
    mohLicenseNo: 'MOH-HCMC-8410',
    batchNo: 'DI26-7102',
    expiryDate: 'HSD 07/2028',
    category: 'enhancement',
    nominalWidth: 'Chai 10ml (~20 lần)',
    shortWidth: 'Chai 10ml',
    thickness: 'Desirex™ ấm & mát',
    shortThickness: 'Desirex™ ấm/mát',
    material: 'Kích thích sau 2–5 phút',
    shortMaterial: 'Sau 2–5 phút',
    shortExpiry: '07/2028',
    lubricant: 'Tinh chất gốc nước dễ rửa',
    highlightBadge: 'Ấm & Mát dịu • Tăng hưng phấn',
    keyIngredients: [
      'Công thức Desirex™ tạo sóng ấm, mát và rung nhẹ tự nhiên',
      'Nền nước tinh khiết, không paraben, không dầu khoáng',
      'Tương thích an toàn với bao cao su cao su thiên nhiên',
    ],
    summary:
      'Tinh chất gốc nước tạo hiệu ứng ấm nóng xen mát dịu giúp tăng tuần hoàn tại chỗ, đánh thức độ nhạy cảm và hỗ trợ nữ giới dễ lên đỉnh hơn.',
    usageGuide:
      'Xoay đầu bơm lấy 2–3 giọt thoa nhẹ lên vùng âm vật trước khi bắt đầu; đợi 2–5 phút để cảm nhận hiệu ứng ấm/mát lan tỏa.',
    safetyWarning:
      'Chỉ dùng ngoài vùng nhạy cảm, không phải gel bôi trơn toàn phần. Thử 1 giọt nhỏ nếu cơ địa dễ kích ứng; ngưng dùng nếu thấy nóng rát khó chịu hoặc có vết thương hở.',
    fitTags: ['warm-tingle', 'premium', 'pleasure'],
    accentTone: 'coral',
    reviews: [
      {
        id: 'rev-18',
        author: 'Khách ẩn danh',
        district: 'Quận 1',
        rating: 5,
        comment:
          'Chỉ cần 2 giọt là cảm giác ấm mát rất tự nhiên chứ không bị cay gắt, dùng cùng bao cao su không bị ảnh hưởng.',
        verifiedDate: '2 ngày trước',
      },
    ],
  },
  {
    id: 'ky-duration-gel',
    name: 'Gel Thảo Dược Kéo Dài Dịu Nhẹ 30ml',
    shortName: 'Gel Kéo Dài Dịu Nhẹ',
    packSize: 'Tuýp 30ml',
    priceVnd: 245000,
    pharmacyPartner: 'Xuất kho Q.10',
    district: 'Quận 10',
    mohLicenseNo: 'MOH-HCMC-9132',
    batchNo: 'KD26-3418',
    expiryDate: 'HSD 11/2028',
    category: 'enhancement',
    nominalWidth: 'Tuýp 30ml nhỏ gọn',
    shortWidth: 'Tuýp 30ml',
    thickness: 'Bạc hà + L-Arginine',
    shortThickness: 'Bạc hà + Arginine',
    material: 'Thấm 5–10p • Kéo dài êm',
    shortMaterial: 'Thấm 5–10 phút',
    shortExpiry: '11/2028',
    lubricant: 'Gốc nước thảo dược không tê gắt',
    highlightBadge: 'Thảo dược dịu nhẹ • Không tê cứng',
    keyIngredients: [
      'Chiết xuất bạc hà dịu + đinh hương chuẩn hóa liều nhẹ',
      'L-Arginine hỗ trợ duy trì lưu thông ổn định tự nhiên',
      'Gốc nước không cồn, không gây tê mất cảm giác hoàn toàn',
    ],
    summary:
      'Gel hỗ trợ kéo dài thời gian chiết xuất thảo dược dịu nhẹ giúp làm dịu độ nhạy quá mức mà vẫn giữ được cảm giác chân thật và mượt mà.',
    usageGuide:
      'Lấy lượng bằng hạt đậu thoa đều quanh phần đầu và rãnh quy đầu trước 5–10 phút cho gel thấm khô nhẹ trước khi quan hệ hoặc đeo bao.',
    safetyWarning:
      'Không bôi lên vùng da trầy xước hoặc đang viêm nhiễm. Tránh tiếp xúc mắt; rửa sạch với nước ấm nếu muốn giảm cường độ mát.',
    fitTags: ['prolong-gentle', 'premium', 'pleasure'],
    accentTone: 'teal',
    reviews: [
      {
        id: 'rev-19',
        author: 'Khách ẩn danh',
        district: 'Quận 10',
        rating: 5,
        comment:
          'Dịu êm hẳn, không bị tê cứng mất cảm giác như mấy loại rẻ tiền ngoài thị trường. Tuýp nhỏ bỏ túi cực kín.',
        verifiedDate: '4 ngày trước',
      },
    ],
  },
  {
    id: 'stud-gentle-spray',
    name: 'Xịt Hỗ Trợ Kéo Dài Dịu Nhẹ + Vit E',
    shortName: 'Xịt Kéo Dài + Vit E',
    packSize: 'Chai xịt 15ml',
    priceVnd: 285000,
    pharmacyPartner: 'Nhà thuốc GPP Q.7',
    district: 'Quận 7',
    mohLicenseNo: 'MOH-HCMC-9540',
    batchNo: 'ST26-6049',
    expiryDate: 'HSD 08/2028',
    category: 'enhancement',
    nominalWidth: 'Chai xịt 15ml',
    shortWidth: 'Xịt 15ml',
    thickness: 'Lidocaine 9,6% + Vit E',
    shortThickness: 'Lidocaine + Vit E',
    material: 'Sau 10p • Bền 30–45 phút',
    shortMaterial: 'Sau 10p • Bền 40p',
    shortExpiry: '08/2028',
    lubricant: 'Sương mịn kèm Vitamin E dưỡng ẩm',
    highlightBadge: 'Xịt chuẩn liều 15ml • Bổ sung Vit E',
    keyIngredients: [
      'Lidocaine 9,6% định liều chuẩn y tế kiểm soát xuất tinh sớm',
      'Vitamin E tự nhiên giảm khô rát và làm dịu bề mặt da',
      'Đầu xịt định lượng chính xác, không mùi nồng',
    ],
    summary:
      'Dung dịch xịt định liều giúp giảm hưng phấn cục bộ quá mức, kéo dài thời gian quan hệ chủ động với bổ sung Vitamin E dịu da.',
    usageGuide:
      'Xịt 1–2 nhát (tối đa 3 nhát) vào vùng nhạy cảm trước 10 phút; đợi thấm hoàn toàn rồi lau nhẹ bằng khăn ẩm trước khi tiếp xúc trực tiếp hoặc đeo bao.',
    safetyWarning:
      'Bắt buộc rửa/lau sạch phần dư sau 10 phút nếu quan hệ không dùng bao để tránh làm giảm cảm giác của đối tác. Không dùng cho người dị ứng thuốc tê nhóm amide hoặc có vết thương hở.',
    fitTags: ['prolong-gentle', 'premium'],
    accentTone: 'slate',
    reviews: [
      {
        id: 'rev-20',
        author: 'Khách ẩn danh',
        district: 'Quận 7',
        rating: 5,
        comment:
          'Xịt đúng 2 nhát rồi đợi 10p lau nhẹ trước khi đeo bao là kiểm soát nhịp độ chuẩn chỉnh luôn.',
        verifiedDate: '6 ngày trước',
      },
    ],
  },

  // ===================== GEL BÔI TRƠN CƠ BẢN =====================
  {
    id: 'durex-naturals',
    name: 'Durex Naturals Gel Gốc Nước',
    shortName: 'Durex Naturals Gel',
    packSize: 'Chai 100ml',
    priceVnd: 160000,
    pharmacyPartner: 'Xuất kho Thủ Đức',
    district: 'Thủ Đức',
    mohLicenseNo: 'MOH-HCMC-7805',
    batchNo: 'DN26-2209',
    expiryDate: 'HSD 09/2028',
    category: 'lubricant',
    nominalWidth: 'Chai 100ml',
    shortWidth: 'Chai 100ml',
    thickness: 'Prebiotic cân bằng pH',
    shortThickness: 'Prebiotic pH dịu',
    material: '100% Gốc nước tự nhiên',
    shortMaterial: 'Ẩm mượt tức thì',
    shortExpiry: '09/2028',
    lubricant: 'Prebiotic dưỡng ẩm',
    highlightBadge: 'Gốc nước pH cân bằng',
    keyIngredients: [
      '100% thành phần có nguồn gốc tự nhiên',
      'Lactic acid Prebiotic giúp cân bằng pH dịu nhẹ',
      'Không hương liệu, không glycerin, không phẩm màu',
    ],
    summary:
      'Gel bôi trơn gốc nước chuẩn pH kết hợp prebiotic tự nhiên, dịu nhẹ cho da nhạy cảm và an toàn với mọi loại bao.',
    usageGuide:
      'Lấy lượng vừa đủ thoa đều trước hoặc trong khi sử dụng bao cao su; rửa sạch dễ dàng bằng nước sau khi xong.',
    safetyWarning:
      'Tránh tiếp xúc với mắt. Không dùng thay thế biện pháp tránh thai; ngưng nếu có dấu hiệu kích ứng.',
    fitTags: ['water-based-gel', 'fragrance-free', 'sensitive', 'under-160', 'smooth-hydration'],
    accentTone: 'coral',
    reviews: [
      {
        id: 'rev-7',
        author: 'Khách ẩn danh',
        district: 'Thủ Đức',
        rating: 5,
        comment:
          'Không mùi hóa chất, rửa nước sạch ngay và cực kỳ dịu cho da nhạy cảm.',
        verifiedDate: '4 ngày trước',
      },
      {
        id: 'rev-8',
        author: 'Khách ẩn danh',
        district: 'Quận 10',
        rating: 5,
        comment:
          'Chai bọc chống sốc nằm gọn trong hộp nâu trơn. Bạn cùng phòng nhìn không đoán được.',
        verifiedDate: '1 tuần trước',
      },
    ],
  },
  {
    id: 'sagami-glide-gel',
    name: 'Sagami Original Glide Gốc Nước',
    shortName: 'Sagami Original Glide',
    packSize: 'Tuýp 60g',
    priceVnd: 175000,
    pharmacyPartner: 'Xuất kho Q.3',
    district: 'Quận 3',
    mohLicenseNo: 'MOH-HCMC-8024',
    batchNo: 'SG26-9015',
    expiryDate: 'HSD 12/2028',
    category: 'lubricant',
    nominalWidth: 'Tuýp 60g',
    shortWidth: 'Tuýp 60g',
    thickness: 'Nước tinh khiết + HA',
    shortThickness: 'Tinh khiết + HA',
    material: 'Mượt lâu, không bết rít',
    shortMaterial: 'Mượt lâu không rít',
    shortExpiry: '12/2028',
    lubricant: 'Gốc nước chuẩn y tế Nhật',
    highlightBadge: 'Gốc nước Nhật • Không paraben',
    keyIngredients: [
      'Nền nước tinh khiết vô trùng chuẩn thiết bị y tế Nhật',
      'Bổ sung Sodium Hyaluronate giữ ẩm mượt lâu hơn',
      'Không mùi, không chất tạo màu, không paraben',
    ],
    summary:
      'Gel bôi trơn gốc nước tinh khiết đến từ Sagami Nhật Bản, không dính rít, không ố ga giường và lý tưởng cho da siêu nhạy cảm.',
    usageGuide:
      'Phù hợp dùng cùng cả bao Latex lẫn Polyurethane 0.01–0.02mm; nắp bật tiện lợi một tay.',
    safetyWarning:
      'Đậy kín nắp sau khi dùng và bảo quản nơi khô ráo; không dùng nếu bao bì tuýp bị rách seal.',
    fitTags: ['water-based-gel', 'fragrance-free', 'sensitive', 'mid-range', 'smooth-hydration'],
    accentTone: 'sage',
    reviews: [
      {
        id: 'rev-21',
        author: 'Khách ẩn danh',
        district: 'Quận 3',
        rating: 5,
        comment:
          'Kết cấu mượt như nước thật chứ không bị đặc quánh hay khô vón cục. Rửa nước là sạch tinh.',
        verifiedDate: '3 ngày trước',
      },
    ],
  },
];

export const HCMC_CENTER = { lat: 10.7769, lng: 106.6951 };

export const DISTRICT_FILTER_OPTIONS: Array<{
  label: Exclude<import('../types').DistrictFilter, 'ALL'>;
  lat: number;
  lng: number;
  panX: number;
  panY: number;
  scale: number;
}> = [
  { label: 'Q.1', lat: 10.7738, lng: 106.7031, panX: -12, panY: -10, scale: 1.4 },
  { label: 'Q.3', lat: 10.7756, lng: 106.6889, panX: -2, panY: -6, scale: 1.4 },
  { label: 'Q.7', lat: 10.7326, lng: 106.6991, panX: -8, panY: -24, scale: 1.4 },
  { label: 'Q.10', lat: 10.7721, lng: 106.6579, panX: 16, panY: -10, scale: 1.4 },
  { label: 'Bình Thạnh', lat: 10.8019, lng: 106.7147, panX: -16, panY: 8, scale: 1.4 },
  { label: 'Gò Vấp', lat: 10.8222, lng: 106.6874, panX: 6, panY: 20, scale: 1.4 },
  { label: 'Tân Bình', lat: 10.8012, lng: 106.6528, panX: 20, panY: 8, scale: 1.4 },
  { label: 'Thủ Đức', lat: 10.8805, lng: 106.7824, panX: -24, panY: 20, scale: 1.35 },
];

export const SMART_LOCKER_LOCATIONS: SmartLockerLocation[] = [
  {
    id: 'locker-d10',
    lockerCode: 'LK-Q10-04',
    name: 'Tủ Smart Locker ĐH Bách Khoa (Q.10)',
    district: 'Quận 10',
    districtShort: 'Q.10',
    addressHint: '268 Lý Thường Kiệt, P.14, Quận 10 (Cổng sau KTX)',
    openHours: 'Tự nhận 24/7',
    availableSlots: 6,
    lat: 10.7721,
    lng: 106.6579,
    mapX: 28,
    mapY: 66,
  },
  {
    id: 'locker-d3',
    lockerCode: 'LK-Q3-08',
    name: 'Tủ Smart Locker Võ Văn Tần (Q.3)',
    district: 'Quận 3',
    districtShort: 'Q.3',
    addressHint: '192 Võ Văn Tần, P.5, Quận 3 (Kế cửa hàng tiện lợi 24h)',
    openHours: 'Tự nhận 24/7',
    availableSlots: 4,
    lat: 10.7756,
    lng: 106.6889,
    mapX: 48,
    mapY: 57,
  },
  {
    id: 'locker-d1',
    lockerCode: 'LK-Q1-02',
    name: 'Tủ Smart Locker Tôn Thất Thiệp (Q.1)',
    district: 'Quận 1',
    districtShort: 'Q.1',
    addressHint: '42 Tôn Thất Thiệp, P. Bến Nghé, Quận 1 (Sảnh trệt)',
    openHours: 'Tự nhận 24/7',
    availableSlots: 5,
    lat: 10.7738,
    lng: 106.7031,
    mapX: 62,
    mapY: 63,
  },
  {
    id: 'locker-d7',
    lockerCode: 'LK-Q7-09',
    name: 'Tủ Smart Locker Nguyễn Hữu Thọ (Q.7)',
    district: 'Quận 7',
    districtShort: 'Q.7',
    addressHint: '19 Nguyễn Hữu Thọ, P. Tân Phong, Quận 7 (Gần TDTU & RMIT)',
    openHours: 'Tự nhận 24/7',
    availableSlots: 8,
    lat: 10.7326,
    lng: 106.6991,
    mapX: 56,
    mapY: 85,
  },
  {
    id: 'locker-bt',
    lockerCode: 'LK-BT-07',
    name: 'Tủ Smart Locker Nguyễn Gia Trí (Bình Thạnh)',
    district: 'Bình Thạnh',
    districtShort: 'Bình Thạnh',
    addressHint: '69 Nguyễn Gia Trí (D2), P.25, Bình Thạnh (Gần HUTECH)',
    openHours: 'Tự nhận 24/7',
    availableSlots: 7,
    lat: 10.8019,
    lng: 106.7147,
    mapX: 66,
    mapY: 39,
  },
  {
    id: 'locker-gv',
    lockerCode: 'LK-GV-05',
    name: 'Tủ Smart Locker Nguyễn Văn Bảo (Gò Vấp)',
    district: 'Gò Vấp',
    districtShort: 'Gò Vấp',
    addressHint: '12 Nguyễn Văn Bảo, P.4, Gò Vấp (Đối diện ĐH Công Nghiệp IUH)',
    openHours: 'Tự nhận 24/7',
    availableSlots: 6,
    lat: 10.8222,
    lng: 106.6874,
    mapX: 43,
    mapY: 22,
  },
  {
    id: 'locker-tb',
    lockerCode: 'LK-TB-03',
    name: 'Tủ Smart Locker Cộng Hòa (Tân Bình)',
    district: 'Tân Bình',
    districtShort: 'Tân Bình',
    addressHint: '20 Cộng Hòa, P.12, Tân Bình (Sảnh trệt Pico Plaza)',
    openHours: 'Tự nhận 24/7',
    availableSlots: 5,
    lat: 10.8012,
    lng: 106.6528,
    mapX: 18,
    mapY: 40,
  },
  {
    id: 'locker-thuduc',
    lockerCode: 'LK-TD-12',
    name: 'Tủ Smart Locker KTX Khu B (Thủ Đức)',
    district: 'Thủ Đức',
    districtShort: 'Thủ Đức',
    addressHint: 'Khu đô thị ĐHQG TP.HCM, Thủ Đức (Hành lang Cổng 2)',
    openHours: 'Tự nhận 24/7',
    availableSlots: 9,
    lat: 10.8805,
    lng: 106.7824,
    mapX: 84,
    mapY: 21,
  },
];

export const SITUATION_GUIDES: import('../types').SituationGuide[] = [
  {
    id: 'sit-allergy',
    tag: 'DỊ ỨNG LATEX',
    title: 'Ngứa rát hoặc dị ứng mùi cao su tự nhiên',
    bullets: [
      'Chọn chất liệu Polyurethane 100% không chứa protein Latex.',
      'Hoàn toàn không có mùi cao su hắc, dịu nhẹ cho da nhạy cảm.',
      'Siêu mỏng 0.01mm giúp truyền nhiệt tức thì và dẻo dai gấp 3 lần.',
    ],
    recommendedProductId: 'sagami-001',
    reasonBadge: '100% Non-Latex Nhật Bản',
  },
  {
    id: 'sit-emergency',
    tag: 'SỰ CỐ KHẨN CẤP',
    title: 'Rách/tuột bao hoặc quan hệ chưa bảo vệ trong 72h',
    bullets: [
      'Uống 1 viên Postinor 1 (Levonorgestrel 1,5mg) càng sớm càng tốt.',
      'Hiệu quả cao nhất trong 12–24 giờ đầu, tối đa 72 giờ.',
      'Nếu đã qua 72h (tới 120h), cân nhắc viên thế hệ mới Ella 30mg.',
    ],
    recommendedProductId: 'postinor-1',
    reasonBadge: 'Khẩn cấp 72h • Chuẩn GPP',
  },
  {
    id: 'sit-snug',
    tag: 'CHỐNG TUỘT',
    title: 'Dùng size 52mm bị dư đầu hoặc dễ tuột',
    bullets: [
      'Chọn size 49mm ôm sát chuẩn hơn cho chu vi dưới 10cm.',
      'Giữ cố định chắc chắn suốt quá trình, giảm lo lắng tuột bao.',
      'Độ mỏng 0.04mm kết hợp rãnh nhẹ vẫn giữ cảm giác tự nhiên.',
    ],
    recommendedProductId: 'okamoto-harmony',
    reasonBadge: 'Size nhỏ 49mm ôm khít',
  },
  {
    id: 'sit-large',
    tag: 'THOẢI MÁI',
    title: 'Đeo loại thường bị bó chặt, hằn đau vòng gốc',
    bullets: [
      'Độ rộng 55mm rộng rãi hơn, phù hợp chu vi trên 11cm.',
      'Chất liệu Polyurethane mỏng 0.02mm giảm áp lực thắt ở gốc.',
      'Không chứa Latex, an toàn ngay cả khi cơ địa dễ kích ứng.',
    ],
    recommendedProductId: 'sagami-002-large',
    reasonBadge: 'Size lớn 55mm • Không Latex',
  },
  {
    id: 'sit-dryness',
    tag: 'GIẢM MA SÁT',
    title: 'Khô rát, cần bổ sung ẩm dịu nhẹ an toàn',
    bullets: [
      'Gel gốc nước 100% cân bằng pH sinh lý, không gây kích ứng.',
      'Không chứa glycerin hay hương liệu nhân tạo, rửa sạch nhanh.',
      'Tương thích an toàn với cả bao Latex lẫn Polyurethane.',
    ],
    recommendedProductId: 'durex-naturals',
    reasonBadge: 'Gel gốc nước pH cân bằng',
  },
];

export interface QuizOption {
  value: string;
  label: string;
  detail: string;
}

export interface QuizStepDefinition {
  id: keyof QuizAnswers;
  question: string;
  helper: string;
  options: QuizOption[];
}

export const QUIZ_GOAL_OPTIONS: QuizOption[] = [
  {
    value: 'condom',
    label: 'Bảo vệ an toàn & cảm giác chân thật',
    detail: 'Bao cao su siêu mỏng, đúng size 49–56mm hoặc gân gai tăng cảm xúc',
  },
  {
    value: 'contraceptive',
    label: 'Tránh thai chủ động / Dự phòng khẩn cấp',
    detail: 'Thuốc tránh thai khẩn cấp 72h–120h hoặc vỉ uống hàng ngày 28 viên',
  },
  {
    value: 'enhancement',
    label: 'Tăng hưng phấn, kéo dài cuộc vui hoặc giảm khô rát',
    detail: 'Gel tăng khoái cảm ấm/mát, hỗ trợ kéo dài dịu nhẹ hoặc gel bôi trơn',
  },
];

const QUIZ_PREFERENCE_BY_GOAL: Record<QuizGoal, QuizStepDefinition> = {
  condom: {
    id: 'preference',
    question: 'Ưu tiên size & cảm giác bao cao su?',
    helper: 'Chọn theo kích thước thực tế hoặc chất liệu bạn thấy thoải mái nhất.',
    options: [
      {
        value: 'snug-49',
        label: 'Ôm sát 49mm — Chống tuột, chắc chắn',
        detail: 'Phù hợp chu vi < 10cm, ôm khít tự nhiên',
      },
      {
        value: 'standard-thin',
        label: 'Siêu mỏng chân thật / Có gân gai (52–56mm)',
        detail: 'Truyền nhiệt nhanh 0.03–0.04mm, dễ đeo hoặc tăng kích thích',
      },
      {
        value: 'large-nonlatex',
        label: 'Size lớn 55mm+ hoặc Không Latex (dị ứng cao su)',
        detail: '100% Polyurethane 0.01–0.02mm rộng rãi, không mùi cao su',
      },
    ],
  },
  contraceptive: {
    id: 'preference',
    question: 'Tình huống tránh thai bạn đang cần?',
    helper: 'Chọn đúng loại theo thời điểm sử dụng để đạt hiệu quả y tế tối ưu.',
    options: [
      {
        value: 'emergency-72h',
        label: 'Khẩn cấp trong 72h (1 viên duy nhất)',
        detail: 'Levonorgestrel 1,5mg — hiệu quả cao nhất khi uống sớm trong 12–24h',
      },
      {
        value: 'emergency-120h',
        label: 'Khẩn cấp thế hệ mới đến 120h (5 ngày)',
        detail: 'Ulipristal acetate 30mg — ổn định hơn khi gần ngày rụng trứng',
      },
      {
        value: 'daily-28',
        label: 'Tránh thai hàng ngày chủ động (Vỉ 28 viên)',
        detail: 'Uống đều 1 khung giờ mỗi ngày giúp bảo vệ liên tục và điều hòa chu kỳ',
      },
    ],
  },
  enhancement: {
    id: 'preference',
    question: 'Hiệu ứng hoặc hỗ trợ bạn ưu tiên?',
    helper: 'Tất cả đều chọn lọc công thức dịu nhẹ, an toàn vùng nhạy cảm.',
    options: [
      {
        value: 'warm-tingle',
        label: 'Tăng hưng phấn ấm / mát tự nhiên',
        detail: 'Tinh chất gốc nước tạo sóng ấm mát nhẹ, đánh thức độ nhạy',
      },
      {
        value: 'prolong-gentle',
        label: 'Hỗ trợ kéo dài thời gian dịu nhẹ',
        detail: 'Gel thảo dược hoặc xịt định liều Vitamin E không tê gắt',
      },
      {
        value: 'smooth-hydration',
        label: 'Giảm khô rát, bôi trơn gốc nước êm mượt',
        detail: 'Cân bằng pH sinh lý, rửa sạch nhanh và hợp mọi loại bao cao su',
      },
    ],
  },
};

export const QUIZ_BUDGET_OPTIONS: QuizOption[] = [
  {
    value: 'under-160',
    label: 'Tiết kiệm (< 160.000đ)',
    detail: '55.000đ – 160.000đ • Dễ thử, chi phí tối ưu cho sinh viên',
  },
  {
    value: '160-240',
    label: 'Cân bằng (160.000đ – 240.000đ)',
    detail: '165.000đ – 225.000đ • Nhiều lựa chọn phổ biến nhất',
  },
  {
    value: 'over-240',
    label: 'Cao cấp (240.000đ+)',
    detail: '245.000đ – 290.000đ • Công thức chuyên sâu / Non-Latex 0.01–0.02mm',
  },
];

export function getQuizStepConfig(
  stepIndex: number,
  goal: QuizGoal | ''
): QuizStepDefinition {
  if (stepIndex === 0) {
    return {
      id: 'goal',
      question: 'Mục tiêu chính hôm nay của bạn?',
      helper: 'Chọn nhanh 1 nhánh — gợi ý lọc 100% trên thiết bị, không lưu lịch sử.',
      options: QUIZ_GOAL_OPTIONS,
    };
  }
  if (stepIndex === 1) {
    return QUIZ_PREFERENCE_BY_GOAL[goal || 'condom'];
  }
  return {
    id: 'budget',
    question: 'Mức ngân sách dự kiến?',
    helper: 'Xuất kho trực tiếp từ nhà thuốc TP.HCM & đóng hộp nâu trơn kín đáo.',
    options: QUIZ_BUDGET_OPTIONS,
  };
}

function getPriceBudgetMatch(
  priceVnd: number,
  budget: string
): { score: number; reason?: string } {
  if (budget === 'under-160') {
    if (priceVnd <= 160000) {
      return {
        score: 5,
        reason: `nằm gọn mức tiết kiệm ${formatVnd(priceVnd)}`,
      };
    }
    if (priceVnd <= 195000) {
      return {
        score: 2,
        reason: `giá hợp lý ${formatVnd(priceVnd)}`,
      };
    }
    return { score: 0 };
  }
  if (budget === '160-240') {
    if (priceVnd >= 160000 && priceVnd <= 240000) {
      return {
        score: 5,
        reason: `khớp ngân sách cân bằng ${formatVnd(priceVnd)}`,
      };
    }
    if (priceVnd < 160000) {
      return {
        score: 3,
        reason: `tiết kiệm hơn dự kiến (${formatVnd(priceVnd)})`,
      };
    }
    return { score: 1 };
  }
  if (budget === 'over-240') {
    if (priceVnd >= 240000) {
      return {
        score: 5,
        reason: `phân khúc chuyên sâu ${formatVnd(priceVnd)}`,
      };
    }
    if (priceVnd >= 185000) {
      return {
        score: 2,
        reason: `lựa chọn đáng cân nhắc ${formatVnd(priceVnd)}`,
      };
    }
    return { score: 0 };
  }
  return { score: 0 };
}

export function matchQuizProducts(answers: QuizAnswers): QuizMatchResult[] {
  const goal: QuizGoal = answers.goal || 'condom';

  // Lọc ứng viên theo nhóm mục tiêu Câu 1
  const candidates = PRODUCTS.filter((p) => {
    if (goal === 'condom') return p.category === 'condom';
    if (goal === 'contraceptive') return p.category === 'contraceptive';
    return p.category === 'enhancement' || p.category === 'lubricant';
  });

  const scored = candidates
    .map((product) => {
      let score = 10; // Base score trong đúng nhóm mục tiêu
      const reasons: string[] = [];

      // Câu 2: Ưu tiên / Gu trải nghiệm theo từng nhánh
      if (goal === 'condom') {
        if (answers.preference === 'snug-49') {
          if (product.id === 'okamoto-harmony') {
            score += 12;
            reasons.push('Size 49mm ôm sát vừa vặn, chống tuột hiệu quả');
          } else if (product.shortWidth === '52mm') {
            score += 4;
            reasons.push('Size 52mm ôm vừa nếu thích độ mỏng cao hơn');
          }
        } else if (answers.preference === 'standard-thin') {
          if (product.id === 'durex-invisible') {
            score += 10;
            reasons.push('Siêu mỏng 0.04mm chân thật, size 52mm chuẩn');
          } else if (product.id === 'okamoto-003-ha') {
            score += 10;
            reasons.push('Siêu mỏng 0.03mm phủ HA cấp ẩm êm mượt');
          } else if (product.id === 'durex-pleasuremax') {
            score += 9;
            reasons.push('Kết hợp gân & hạt gai nổi tăng khoái cảm rõ rệt');
          } else if (product.id === 'durex-jeans') {
            score += 6;
            reasons.push('Dáng Easy-On dễ đeo, nhiều gel mượt mà');
          }
        } else if (answers.preference === 'large-nonlatex') {
          if (product.id === 'sagami-001') {
            score += 12;
            reasons.push('100% Polyurethane không Latex, siêu mỏng 0.01mm');
          } else if (product.id === 'sagami-002-large') {
            score += 12;
            reasons.push('Size lớn 55mm rộng rãi, 100% không mùi cao su');
          } else if (product.id === 'durex-pleasuremax') {
            score += 5;
            reasons.push('Độ rộng 56mm thoải mái, có gân gai kích thích');
          }
        }
      } else if (goal === 'contraceptive') {
        if (answers.preference === 'emergency-72h') {
          if (product.id === 'postinor-1') {
            score += 14;
            reasons.push('Đúng nhu cầu khẩn cấp 72h (1 viên Levonorgestrel 1,5mg)');
          } else if (product.id === 'ella-120h') {
            score += 6;
            reasons.push('Dự phòng mở rộng tới 120h nếu sát ngày rụng trứng');
          }
        } else if (answers.preference === 'emergency-120h') {
          if (product.id === 'ella-120h') {
            score += 14;
            reasons.push('Thế hệ mới Ulipristal 30mg hiệu quả ổn định đến 120h');
          } else if (product.id === 'postinor-1') {
            score += 5;
            reasons.push('Lựa chọn khẩn cấp phổ thông nếu chưa quá 72 giờ');
          }
        } else if (answers.preference === 'daily-28') {
          if (product.id === 'marvelon-28') {
            score += 14;
            reasons.push('Vỉ 28 viên uống hàng ngày giúp tránh thai chủ động 99%');
          } else {
            score += 2;
            reasons.push('Giải pháp dự phòng khẩn cấp nếu có sự cố quên thuốc');
          }
        }
      } else if (goal === 'enhancement') {
        if (answers.preference === 'warm-tingle') {
          if (product.id === 'durex-intense-gel') {
            score += 14;
            reasons.push('Hiệu ứng Desirex™ ấm & mát tự nhiên tăng hưng phấn');
          } else if (product.category === 'lubricant') {
            score += 5;
            reasons.push('Nền gel gốc nước mượt mà giúp giảm ma sát khi kết hợp');
          }
        } else if (answers.preference === 'prolong-gentle') {
          if (product.id === 'ky-duration-gel') {
            score += 13;
            reasons.push('Thảo dược bạc hà + L-Arginine dịu nhẹ không tê cứng');
          } else if (product.id === 'stud-gentle-spray') {
            score += 12;
            reasons.push('Xịt định liều Lidocaine 9,6% kèm Vitamin E kiểm soát nhịp độ');
          } else if (product.id === 'durex-intense-gel') {
            score += 3;
          }
        } else if (answers.preference === 'smooth-hydration') {
          if (product.id === 'durex-naturals') {
            score += 13;
            reasons.push('100% gốc nước Prebiotic cân bằng pH, dịu da nhạy cảm');
          } else if (product.id === 'sagami-glide-gel') {
            score += 12;
            reasons.push('Gel gốc nước Nhật tinh khiết, mượt lâu không bết rít');
          } else if (product.id === 'ky-duration-gel') {
            score += 4;
            reasons.push('Gốc nước êm mượt kèm hỗ trợ kéo dài dịu nhẹ');
          }
        }
      }

      // Câu 3: Ngân sách dự kiến
      const budgetMatch = getPriceBudgetMatch(product.priceVnd, answers.budget);
      score += budgetMatch.score;
      if (budgetMatch.reason) {
        reasons.push(budgetMatch.reason);
      }

      const formattedReasons = Array.from(
        new Set(reasons.map((r) => r.charAt(0).toUpperCase() + r.slice(1)))
      ).slice(0, 2);

      if (formattedReasons.length === 0) {
        formattedReasons.push(`Phù hợp nhóm bạn chọn (${product.packSize})`);
      }

      let timingNote: string | undefined;
      if (product.category === 'contraceptive') {
        timingNote = product.usageGuide;
      } else if (product.category === 'enhancement') {
        timingNote = `Thời điểm dùng: ${product.usageGuide}`;
      }

      return {
        product,
        score,
        reasons: formattedReasons,
        timingNote,
      };
    })
    .sort((a, b) => b.score - a.score);

  const labels = ['Khớp nhất #1', 'Gợi ý #2', 'Lựa chọn #3'];
  const topCount = Math.min(3, scored.length);

  return scored.slice(0, topCount).map((entry, idx) => ({
    product: entry.product,
    matchLabel: labels[idx] ?? `Gợi ý #${idx + 1}`,
    reasons: entry.reasons,
    timingNote: entry.timingNote,
  }));
}
