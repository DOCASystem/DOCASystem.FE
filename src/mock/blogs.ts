import { GetBlogDetailResponse, BlogEnum } from "@/api/generated";

// Dữ liệu blog mẫu
export const mockBlogs: GetBlogDetailResponse[] = [
  {
    id: "1",
    name: "Cách chăm sóc chó con mới sinh",
    description:
      "Chăm sóc chó con mới sinh là một việc đòi hỏi sự kiên nhẫn và tỉ mỉ. Dưới đây là những kinh nghiệm và lời khuyên hữu ích để giúp bạn chăm sóc chó con mới sinh khỏe mạnh và an toàn.\n\nVệ sinh: Đảm bảo khu vực ở của chó con luôn sạch sẽ và khô ráo. Thay chăn, ga, nệm thường xuyên để tránh vi khuẩn phát triển.\n\nChế độ ăn: Trong 2-3 tuần đầu tiên, chó con chỉ cần sữa mẹ. Nếu không có sữa mẹ, bạn có thể sử dụng sữa công thức dành cho chó con.\n\nNhiệt độ: Chó con cần được giữ ấm vì chúng không thể tự điều chỉnh nhiệt độ cơ thể. Nhiệt độ lý tưởng là khoảng 30-32°C trong tuần đầu tiên, sau đó giảm dần.\n\nTiêm phòng: Đảm bảo chó con được tiêm phòng đầy đủ theo lịch để phòng ngừa các bệnh nguy hiểm.",
    createdAt: "2023-10-15T08:00:00Z",
    modifiedAt: "2023-10-15T08:00:00Z",
    status: BlogEnum.NUMBER_1,
    isHidden: false,
    blogCategories: [
      {
        id: "cat1",
        name: "Chăm sóc thú cưng",
      },
    ],
  },
  {
    id: "2",
    name: "10 lưu ý khi nuôi mèo trong chung cư",
    description:
      "Nuôi mèo trong chung cư ngày càng phổ biến nhưng cũng có nhiều thách thức. Bài viết này sẽ chia sẻ 10 lưu ý quan trọng giúp bạn và mèo cưng sống hạnh phúc trong không gian chung cư.\n\n1. Chọn giống mèo phù hợp: Một số giống mèo như Ragdoll, Exotic Shorthair hay Mèo Anh lông ngắn thích nghi tốt với không gian nhỏ hẹp của chung cư.\n\n2. Tạo không gian riêng cho mèo: Mèo cần có không gian riêng để nghỉ ngơi và cảm thấy an toàn.\n\n3. Khử mùi thường xuyên: Sử dụng cát vệ sinh chất lượng cao và dọn dẹp hàng ngày để tránh mùi khó chịu.\n\n4. An toàn cửa sổ: Đảm bảo cửa sổ và ban công đều được bảo vệ để mèo không rơi xuống.\n\n5. Bảo vệ đồ đạc: Cung cấp bàn cào cho mèo để bảo vệ nội thất của bạn.\n\n6. Vận động hợp lý: Tạo không gian vui chơi và cung cấp đồ chơi để mèo hoạt động thể chất.\n\n7. Kiểm soát ồn ào: Mèo có thể gây ồn, hãy dạy chúng không kêu vào ban đêm.\n\n8. Tương tác hàng ngày: Dành thời gian chơi với mèo để tránh việc chúng cảm thấy cô đơn.\n\n9. Thường xuyên vệ sinh: Lông mèo sẽ bám khắp nơi, hãy vệ sinh nhà cửa thường xuyên.\n\n10. Tôn trọng hàng xóm: Đảm bảo việc nuôi mèo không ảnh hưởng đến người xung quanh.",
    createdAt: "2023-10-20T08:00:00Z",
    modifiedAt: "2023-10-20T08:00:00Z",
    status: BlogEnum.NUMBER_1,
    isHidden: false,
    blogCategories: [
      {
        id: "cat1",
        name: "Chăm sóc thú cưng",
      },
      {
        id: "cat2",
        name: "Mèo",
      },
    ],
  },
  {
    id: "3",
    name: "Các loại thức ăn tốt nhất cho chó",
    description:
      "Chọn đúng thức ăn cho chó là yếu tố quan trọng quyết định sức khỏe và tuổi thọ của chúng. Bài viết này sẽ giới thiệu các loại thức ăn tốt nhất cho chó theo từng độ tuổi và nhu cầu dinh dưỡng cụ thể.\n\nThức ăn khô (Dry food): Đây là lựa chọn phổ biến nhất vì tiện lợi, dễ bảo quản và có tác dụng làm sạch răng cho chó. Một số thương hiệu uy tín như Royal Canin, Hill's Science Diet, Purina Pro Plan đều cung cấp các dòng sản phẩm chất lượng cao.\n\nThức ăn ướt (Wet food): Giàu nước, thơm ngon và dễ ăn cho chó già hoặc chó có vấn đề về răng. Tuy nhiên, loại thức ăn này thường đắt hơn và không giúp làm sạch răng.\n\nThức ăn tươi sống (Raw diet): Ngày càng được ưa chuộng vì gần với chế độ ăn tự nhiên của chó. Tuy nhiên, cần cẩn thận về vệ sinh an toàn thực phẩm.\n\nThức ăn tự nấu: Cho phép kiểm soát hoàn toàn thành phần, tuy nhiên đòi hỏi kiến thức về dinh dưỡng để đảm bảo chế độ ăn cân bằng.\n\nLuôn tham khảo ý kiến bác sĩ thú y trước khi thay đổi chế độ ăn của chó, đặc biệt nếu chúng có vấn đề sức khỏe cụ thể.",
    createdAt: "2023-11-05T08:00:00Z",
    modifiedAt: "2023-11-05T08:00:00Z",
    status: BlogEnum.NUMBER_1,
    isHidden: false,
    blogCategories: [
      {
        id: "cat1",
        name: "Chăm sóc thú cưng",
      },
      {
        id: "cat3",
        name: "Chó",
      },
    ],
  },
  {
    id: "4",
    name: "Những giống mèo dễ nuôi cho người bận rộn",
    description:
      "Nếu bạn là người bận rộn nhưng vẫn muốn nuôi mèo, hãy tham khảo những giống mèo dưới đây. Chúng được đánh giá là độc lập, không đòi hỏi nhiều sự chú ý và dễ thích nghi với cuộc sống một mình.\n\n1. Mèo Mỹ lông ngắn (American Shorthair): Giống mèo này nổi tiếng với tính cách độc lập, dễ thích nghi và không đòi hỏi nhiều sự chăm sóc về lông.\n\n2. Mèo Nga xanh (Russian Blue): Yên tĩnh, ngoan ngoãn và đặc biệt hợp với người sống một mình. Chúng có thể tự giải trí và không gây ồn ào.\n\n3. Mèo Anh lông ngắn (British Shorthair): Tính cách điềm tĩnh, ít đòi hỏi sự quan tâm liên tục và có thể ở một mình trong thời gian dài.\n\n4. Mèo Ragdoll: Mặc dù là giống mèo thân thiện, Ragdoll lại không quá đòi hỏi sự quan tâm. Chúng điềm tĩnh và dễ thích nghi với lịch trình của chủ.\n\n5. Mèo Exotic Shorthair: Phiên bản lông ngắn của mèo Ba Tư, giống mèo này thích một cuộc sống yên tĩnh và không đòi hỏi nhiều hoạt động thể chất.\n\nLưu ý rằng dù là giống mèo nào, chúng vẫn cần được chăm sóc đúng cách về thức ăn, nước uống, vệ sinh và thời gian tương tác đủ để đảm bảo sức khỏe thể chất và tinh thần.",
    createdAt: "2023-11-15T08:00:00Z",
    modifiedAt: "2023-11-15T08:00:00Z",
    status: BlogEnum.NUMBER_1,
    isHidden: false,
    blogCategories: [
      {
        id: "cat2",
        name: "Mèo",
      },
    ],
  },
  {
    id: "5",
    name: "Cách huấn luyện chó nghe lời cơ bản",
    description:
      'Huấn luyện chó là quá trình giúp tạo ra mối quan hệ tốt đẹp giữa bạn và thú cưng. Bài viết này hướng dẫn các bước huấn luyện cơ bản để chó nghe lời và có hành vi tốt.\n\nNguyên tắc cơ bản:\n- Nhất quán: Luôn sử dụng cùng một lệnh cho một hành động cụ thể.\n- Kiên nhẫn: Chó cần thời gian để học và hiểu.\n- Thưởng: Luôn khen thưởng khi chó làm đúng, có thể là đồ ăn, lời khen hoặc vuốt ve.\n\nCác lệnh cơ bản nên dạy:\n\n1. Lệnh "Ngồi" (Sit): Đây thường là lệnh đầu tiên cần dạy. Giữ thức ăn thưởng trên đầu chó và di chuyển về phía sau, tự nhiên chó sẽ ngồi xuống. Nói "Ngồi" khi chó thực hiện và thưởng ngay lập tức.\n\n2. Lệnh "Nằm" (Down): Từ tư thế ngồi, đưa thức ăn thưởng từ mũi chó xuống đất. Khi chó nằm xuống, nói "Nằm" và thưởng.\n\n3. Lệnh "Ở yên" (Stay): Bắt đầu với khoảng thời gian ngắn và tăng dần. Luôn thưởng khi chó giữ được tư thế mà không di chuyển.\n\n4. Lệnh "Lại đây" (Come): Cực kỳ quan trọng cho an toàn. Bắt đầu với dây dắt, dần dần tập không dây trong không gian an toàn.\n\nLuyện tập hàng ngày nhưng trong thời gian ngắn (5-10 phút) sẽ hiệu quả hơn các buổi tập dài. Luôn kết thúc buổi tập bằng một thành công để tạo động lực tích cực cho chó.',
    createdAt: "2023-11-20T08:00:00Z",
    modifiedAt: "2023-11-20T08:00:00Z",
    status: BlogEnum.NUMBER_1,
    isHidden: false,
    blogCategories: [
      {
        id: "cat3",
        name: "Chó",
      },
      {
        id: "cat4",
        name: "Huấn luyện thú cưng",
      },
    ],
  },
  {
    id: "6",
    name: "Những loại cây an toàn và độc hại với mèo",
    description:
      "Nếu bạn là người yêu mèo và cũng thích trang trí nhà bằng cây cảnh, việc biết những loại cây nào an toàn và loại nào độc hại với mèo là rất quan trọng. Bài viết này sẽ liệt kê các loại cây phổ biến an toàn cho mèo và những loại cây bạn nên tránh.\n\nCác loại cây AN TOÀN với mèo:\n\n1. Cỏ mèo (Catnip): Không chỉ an toàn mà còn được mèo rất yêu thích.\n2. Cỏ lúa mì (Wheatgrass): Giàu chất dinh dưỡng và an toàn cho mèo nhai.\n3. Cây chuông xanh (Blue Echeveria): Cây mọng nước an toàn và khó cắn vỡ.\n4. Cây dương xỉ Boston (Boston Fern): An toàn và giúp lọc không khí.\n5. Cây lan quân tử (Parlor Palm): Cây dễ chăm sóc và an toàn với mèo.\n\nCác loại cây ĐỘC HẠI với mèo:\n\n1. Hoa lily: Cực kỳ độc hại, có thể gây suy thận và tử vong nếu mèo ăn bất kỳ phần nào của cây.\n2. Hoa tulip: Đặc biệt là củ, rất độc với mèo.\n3. Cây trầu bà (Pothos): Gây kích ứng miệng, sưng lưỡi và khó thở.\n4. Cây lô hội (Aloe Vera): Mặc dù có lợi cho con người nhưng lại độc với mèo.\n5. Cây lan Ý (Peace Lily): Gây kích ứng miệng và đường tiêu hóa, khiến mèo nôn mửa.\n\nDấu hiệu nhận biết mèo đã ăn phải cây độc hại:\n- Nôn mửa\n- Tiêu chảy\n- Khó thở\n- Sưng miệng hoặc lưỡi\n- Thay đổi nhịp tim\n\nNếu nghi ngờ mèo đã ăn phải cây độc hại, hãy liên hệ bác sĩ thú y ngay lập tức.",
    createdAt: "2023-12-01T08:00:00Z",
    modifiedAt: "2023-12-01T08:00:00Z",
    status: BlogEnum.NUMBER_1,
    isHidden: false,
    blogCategories: [
      {
        id: "cat1",
        name: "Chăm sóc thú cưng",
      },
      {
        id: "cat2",
        name: "Mèo",
      },
    ],
  },
  {
    id: "7",
    name: "Chăm sóc sức khỏe răng miệng cho thú cưng",
    description:
      "Sức khỏe răng miệng là yếu tố quan trọng nhưng thường bị bỏ qua trong chăm sóc thú cưng. Bài viết này cung cấp thông tin về cách chăm sóc răng miệng hiệu quả cho chó và mèo.\n\nTại sao chăm sóc răng miệng lại quan trọng?\nCũng như con người, thú cưng có thể bị các vấn đề về răng miệng như cao răng, viêm nướu, và mất răng. Những vấn đề này không chỉ gây đau đớn mà còn có thể dẫn đến các bệnh nghiêm trọng ở tim, gan và thận.\n\nCác dấu hiệu của vấn đề răng miệng:\n- Hơi thở có mùi khó chịu\n- Nướu đỏ hoặc chảy máu\n- Mất răng\n- Khó khăn khi ăn hoặc nhai\n- Chảy nước bọt quá mức\n\nCách chăm sóc răng miệng cho thú cưng:\n\n1. Đánh răng thường xuyên: Sử dụng bàn chải và kem đánh răng chuyên dụng cho thú cưng (không dùng kem đánh răng của người).\n\n2. Thức ăn và đồ chơi tốt cho răng: Một số loại thức ăn khô và đồ chơi nhai được thiết kế đặc biệt để làm sạch răng.\n\n3. Nước súc miệng: Thêm vào nước uống để giảm mảng bám và vi khuẩn.\n\n4. Kiểm tra răng miệng định kỳ: Thường xuyên kiểm tra miệng thú cưng để phát hiện sớm các vấn đề.\n\n5. Thăm khám nha khoa: Đưa thú cưng đi khám nha khoa ít nhất mỗi năm một lần.\n\nViệc bắt đầu chăm sóc răng miệng khi thú cưng còn nhỏ sẽ giúp chúng quen dần và dễ dàng chấp nhận quy trình này hơn. Tuy nhiên, không bao giờ là quá muộn để bắt đầu chăm sóc răng miệng cho thú cưng của bạn.",
    createdAt: "2023-12-10T08:00:00Z",
    modifiedAt: "2023-12-10T08:00:00Z",
    status: BlogEnum.NUMBER_1,
    isHidden: false,
    blogCategories: [
      {
        id: "cat1",
        name: "Chăm sóc thú cưng",
      },
      {
        id: "cat5",
        name: "Sức khỏe thú cưng",
      },
    ],
  },
  {
    id: "8",
    name: "Cách chuẩn bị nhà cửa an toàn cho thú cưng",
    description:
      "Chuẩn bị một ngôi nhà an toàn cho thú cưng là trách nhiệm quan trọng của mỗi người nuôi. Bài viết này hướng dẫn cách 'pet-proofing' nhà cửa để bảo vệ thú cưng khỏi các nguy hiểm tiềm ẩn.\n\nNhà bếp:\n- Cất giữ thực phẩm độc hại như socola, nho, hành tỏi ở nơi thú cưng không thể tiếp cận.\n- Đậy kín thùng rác.\n- Cất giữ các chất tẩy rửa, thuốc diệt côn trùng trong tủ có khóa.\n- Che các lỗ hở, ổ điện.\n\nPhòng khách:\n- Giữ dây điện và dây sạc gọn gàng hoặc che phủ để tránh thú cưng nhai.\n- Cân nhắc việc sử dụng cây cảnh an toàn với thú cưng.\n- Cố định kệ sách và đồ nội thất có thể đổ.\n\nPhòng tắm:\n- Đậy nắp bồn cầu để tránh thú cưng uống nước hoặc rơi vào.\n- Cất giữ thuốc, mỹ phẩm, đồ vệ sinh cá nhân trong tủ có khóa.\n- Đảm bảo thú cưng không thể tự mở vòi nước.\n\nPhòng ngủ:\n- Cất giữ thuốc, mỹ phẩm ngoài tầm với.\n- Loại bỏ cây cảnh độc hại.\n- Cẩn thận với những món đồ nhỏ như kẹp tóc, nút áo mà thú cưng có thể nuốt.\n\nSân vườn:\n- Sử dụng phân bón và thuốc trừ sâu an toàn cho thú cưng.\n- Tránh trồng cây độc hại.\n- Đảm bảo hàng rào an toàn và không có lỗ hổng để thú cưng trốn.\n\nTips chung:\n- Sử dụng cửa chặn để ngăn thú cưng vào khu vực nguy hiểm.\n- Cất giữ đồ chơi nhỏ, dây thun có thể gây nghẹt thở.\n- Luôn đảm bảo thú cưng có không gian riêng an toàn và thoải mái.\n\nViệc chuẩn bị nhà cửa an toàn cần được thực hiện trước khi đón thú cưng về và cần kiểm tra định kỳ để đảm bảo môi trường luôn an toàn khi thú cưng lớn lên và thay đổi hành vi.",
    createdAt: "2023-12-15T08:00:00Z",
    modifiedAt: "2023-12-15T08:00:00Z",
    status: BlogEnum.NUMBER_1,
    isHidden: false,
    blogCategories: [
      {
        id: "cat1",
        name: "Chăm sóc thú cưng",
      },
    ],
  },
  {
    id: "9",
    name: "Du lịch cùng thú cưng: Những điều cần biết",
    description:
      "Du lịch cùng thú cưng đang ngày càng phổ biến. Bài viết này cung cấp thông tin hữu ích để chuyến đi của bạn và thú cưng trở nên thuận lợi và vui vẻ.\n\nChuẩn bị trước chuyến đi:\n\n1. Kiểm tra sức khỏe: Đưa thú cưng đi khám bác sĩ thú y để đảm bảo chúng đủ sức khỏe để đi du lịch. Cập nhật các mũi tiêm phòng cần thiết.\n\n2. Nghiên cứu về điểm đến: Tìm hiểu về các khách sạn, nhà hàng, công viên thân thiện với thú cưng tại điểm đến. Kiểm tra các quy định đặc biệt về thú cưng của địa phương.\n\n3. Chuẩn bị giấy tờ: Mang theo hồ sơ y tế, giấy chứng nhận tiêm phòng, và một số hình ảnh mới nhất của thú cưng (phòng trường hợp thất lạc).\n\n4. Đánh dấu nhận dạng: Đảm bảo thú cưng đeo thẻ ID với thông tin liên lạc của bạn. Cận nhắc cấy microchip nếu chưa có.\n\nDu lịch bằng ô tô:\n- Sử dụng lồng vận chuyển hoặc dây an toàn chuyên dụng.\n- Dừng xe nghỉ mỗi 2-3 giờ để thú cưng vận động và đi vệ sinh.\n- Không bao giờ để thú cưng một mình trong xe, đặc biệt trong thời tiết nóng hoặc lạnh.\n\nDu lịch bằng máy bay:\n- Kiểm tra chính sách vận chuyển thú cưng của hãng bay.\n- Chọn chuyến bay thẳng khi có thể.\n- Cho thú cưng làm quen với lồng vận chuyển trước chuyến bay.\n- Hạn chế cho ăn trước 4-6 giờ trước khi bay để tránh buồn nôn.\n\nTại điểm đến:\n- Giữ lịch trình ăn uống và đi vệ sinh tương tự như ở nhà.\n- Mang theo đồ chơi và chăn quen thuộc để thú cưng cảm thấy thoải mái.\n- Không bao giờ để thú cưng không có người giám sát ở nơi lạ.\n\nĐồ dùng cần mang theo:\n- Thức ăn và nước quen thuộc\n- Bát ăn và uống nước\n- Dây dắt và vòng cổ\n- Đồ chơi yêu thích\n- Túi dọn phân\n- Thuốc cần thiết\n- Giường hoặc chăn quen thuộc\n\nDu lịch cùng thú cưng đòi hỏi sự chuẩn bị kỹ lưỡng nhưng sẽ mang lại trải nghiệm tuyệt vời cho cả bạn và người bạn bốn chân của mình.",
    createdAt: "2023-12-20T08:00:00Z",
    modifiedAt: "2023-12-20T08:00:00Z",
    status: BlogEnum.NUMBER_1,
    isHidden: false,
    blogCategories: [
      {
        id: "cat1",
        name: "Chăm sóc thú cưng",
      },
      {
        id: "cat6",
        name: "Du lịch cùng thú cưng",
      },
    ],
  },
];

// Hàm phân trang blog
export const getPaginatedBlogs = (page: number = 1, size: number = 9) => {
  // Tính toán phân trang
  const totalItems = mockBlogs.length;
  const totalPages = Math.ceil(totalItems / size);
  const currentPage = page > totalPages ? totalPages : page;
  const startIndex = (currentPage - 1) * size;
  const endIndex = Math.min(startIndex + size, totalItems);

  // Lấy blogs cho trang hiện tại
  const items = mockBlogs.slice(startIndex, endIndex);

  return {
    data: {
      size,
      page: currentPage,
      total: totalItems,
      totalPages,
      items,
    },
  };
};

// Lấy blog theo ID
export const getBlogById = (id: string) => {
  const blog = mockBlogs.find((b) => b.id === id);

  if (!blog) {
    throw new Error("Không tìm thấy bài viết");
  }

  return { data: blog };
};
