export const COLORS = ["#E64B45", "#62A746", "#3869D6", "#E9B82F", "#EB883D", "#9364C5"];
export const LADDERS: Record<number, number> = { 6: 18, 11: 14, 15: 22, 21: 28, 23: 26 };
export const SNAKES: Record<number, number> = { 16: 3, 20: 5, 25: 12, 27: 22, 29: 19 };
export const EVENTS = [2, 3, 4, 5, 7, 9, 10, 12, 13, 14, 17, 18, 19, 22, 24, 26, 28];
export type Team = { id: number; position: number; score: number; finished: boolean };
export type Question = {
  title: string;
  year: string;
  question: string;
  answers: string[];
  correct: number;
  explanation: string;
};
const q = (
  title: string,
  year: string,
  question: string,
  answers: string[],
  correct: number,
  explanation: string,
): Question => ({ title, year, question, answers, correct, explanation });
export const QUESTIONS: Record<number, Question> = {
  2: q(
    "Bối cảnh Đổi mới",
    "1986",
    "Trước Đổi mới, nền kinh tế Việt Nam gặp khó khăn nổi bật nào?",
    [
      "Khủng hoảng kinh tế – xã hội, lạm phát cao",
      "Dư thừa mọi hàng hóa",
      "Đã công nghiệp hóa hoàn toàn",
    ],
    0,
    "Khủng hoảng kinh tế – xã hội và những hạn chế của cơ chế bao cấp đặt ra yêu cầu đổi mới toàn diện.",
  ),
  3: q(
    "Đại hội VI",
    "1986",
    "Đại hội VI (1986) chủ trương thay đổi cơ chế quản lý kinh tế theo hướng nào?",
    [
      "Duy trì hoàn toàn tem phiếu",
      "Phát triển kinh tế hàng hóa nhiều thành phần và đổi mới cơ chế quản lý",
      "Ngừng hoạt động xuất nhập khẩu",
    ],
    1,
    "Đại hội VI xác định đổi mới tư duy kinh tế, khắc phục cơ chế tập trung quan liêu bao cấp và phát triển kinh tế hàng hóa nhiều thành phần.",
  ),
  4: q(
    "Luật Đầu tư",
    "1987",
    "Luật Đầu tư nước ngoài năm 1987 tạo điều kiện cho hoạt động nào?",
    ["Đóng cửa thị trường", "Xóa bỏ mọi doanh nghiệp", "Thu hút vốn và công nghệ từ nước ngoài"],
    2,
    "Luật Đầu tư nước ngoài tạo khung pháp lý quan trọng để thu hút nguồn vốn, công nghệ và kinh nghiệm quản lý.",
  ),
  5: q(
    "Khoán 10",
    "1988",
    "Nghị quyết Khoán 10 xác định đơn vị kinh tế tự chủ trong nông nghiệp là gì?",
    ["Hộ nông dân", "Chỉ các nhà máy", "Chỉ cơ quan nhà nước"],
    0,
    "Khoán 10 công nhận hộ nông dân là đơn vị kinh tế tự chủ, tạo động lực nâng cao năng suất nông nghiệp.",
  ),
  6: q(
    "Xuất khẩu gạo",
    "1989",
    "Để giữ vững thành tựu xuất khẩu gạo, Việt Nam cần tránh điều gì?",
    ["Nâng cao chất lượng gạo", "Chủ quan, chỉ chạy theo sản lượng", "Mở rộng thị trường phù hợp"],
    1,
    "Năm 1989, Việt Nam trở thành nước xuất khẩu gạo quan trọng. Phát triển bền vững đòi hỏi chất lượng, hiệu quả và an ninh lương thực.",
  ),
  7: q(
    "Đổi mới kinh tế",
    "1989",
    "Xóa bỏ bao cấp qua giá có ý nghĩa gì?",
    [
      "Để giá phản ánh quan hệ cung – cầu tốt hơn",
      "Mọi hàng hóa đều miễn phí",
      "Ngừng lưu thông hàng hóa",
    ],
    0,
    "Cải cách giá là một bước chuyển từ cơ chế bao cấp sang cơ chế thị trường có sự quản lý của Nhà nước.",
  ),
  9: q(
    "Cương lĩnh",
    "1991",
    "Đổi mới ở Việt Nam được thực hiện theo cách nào?",
    [
      "Chỉ thay đổi tên cơ quan",
      "Từ bỏ mọi thành tựu cũ",
      "Toàn diện, có bước đi và hình thức phù hợp",
    ],
    2,
    "Đổi mới là quá trình toàn diện, kế thừa thành tựu và lựa chọn bước đi phù hợp với điều kiện đất nước.",
  ),
  10: q(
    "Gia nhập ASEAN",
    "1995",
    "Việt Nam chính thức gia nhập ASEAN vào năm nào?",
    ["1986", "1995", "2007"],
    1,
    "Ngày 28/7/1995, Việt Nam trở thành thành viên thứ bảy của ASEAN, đánh dấu bước tiến trong hội nhập khu vực.",
  ),
  11: q(
    "Bình thường hóa",
    "1995",
    "Năm 1995, Việt Nam bình thường hóa quan hệ ngoại giao với quốc gia nào?",
    ["Hoa Kỳ", "Lào", "Liên Xô"],
    0,
    "Việt Nam và Hoa Kỳ bình thường hóa quan hệ ngoại giao năm 1995, mở ra một giai đoạn hợp tác mới.",
  ),
  12: q(
    "Công nghiệp hóa",
    "1996",
    "Công nghiệp hóa, hiện đại hóa hướng tới mục tiêu nào?",
    [
      "Giảm ứng dụng khoa học",
      "Chỉ phát triển thủ công",
      "Nâng cao năng suất và trình độ phát triển",
    ],
    2,
    "Công nghiệp hóa, hiện đại hóa gắn với ứng dụng khoa học, công nghệ và chuyển dịch cơ cấu kinh tế.",
  ),
  13: q(
    "Khủng hoảng châu Á",
    "1997",
    "Bài học từ khủng hoảng tài chính châu Á là gì?",
    ["Bỏ qua rủi ro tài chính", "Giữ ổn định vĩ mô và quản lý rủi ro", "Ngừng mọi hợp tác khu vực"],
    1,
    "Khủng hoảng năm 1997 cho thấy tầm quan trọng của hệ thống tài chính lành mạnh và ổn định kinh tế vĩ mô.",
  ),
  14: q(
    "Gia nhập APEC",
    "1998",
    "APEC là diễn đàn hợp tác của khu vực nào?",
    ["Châu Á – Thái Bình Dương", "Chỉ châu Âu", "Chỉ châu Phi"],
    0,
    "Việt Nam gia nhập Diễn đàn Hợp tác Kinh tế châu Á – Thái Bình Dương (APEC) vào tháng 11/1998.",
  ),
  15: q(
    "Luật Doanh nghiệp",
    "1999",
    "Luật Doanh nghiệp năm 1999 góp phần thúc đẩy điều gì?",
    [
      "Hạn chế mọi hoạt động kinh doanh",
      "Chỉ cho phép một doanh nghiệp",
      "Quyền tự do kinh doanh theo pháp luật",
    ],
    2,
    "Luật Doanh nghiệp năm 1999 cải thiện môi trường kinh doanh và tạo điều kiện phát triển khu vực doanh nghiệp.",
  ),
  16: q(
    "Hiệp định thương mại",
    "2000",
    "Việt Nam và Hoa Kỳ ký Hiệp định Thương mại song phương (BTA) vào năm nào?",
    ["1995", "2000", "2007"],
    1,
    "Hiệp định Thương mại Việt Nam – Hoa Kỳ được ký ngày 13/7/2000 và có hiệu lực năm 2001, góp phần mở rộng hợp tác thương mại.",
  ),
  17: q(
    "Hội nhập thương mại",
    "2001",
    "Hiệp định Thương mại Việt Nam – Hoa Kỳ có hiệu lực năm 2001 giúp gì?",
    ["Dừng xuất khẩu", "Mở rộng cơ hội thương mại", "Cấm đầu tư"],
    1,
    "Hiệp định tạo điều kiện mở rộng thị trường, thúc đẩy thương mại và cải cách môi trường kinh doanh.",
  ),
  18: q(
    "Phát triển con người",
    "2004",
    "Yếu tố nào là động lực quan trọng cho phát triển lâu dài?",
    ["Giáo dục và chất lượng nguồn nhân lực", "Chỉ khai thác tài nguyên", "Bỏ qua y tế"],
    0,
    "Giáo dục, y tế và chất lượng nguồn nhân lực là nền tảng để tăng trưởng gắn với tiến bộ xã hội.",
  ),
  19: q(
    "Môi trường",
    "2005",
    "Phát triển bền vững đòi hỏi kết hợp tăng trưởng kinh tế với điều gì?",
    ["Khai thác bằng mọi giá", "Bỏ qua ô nhiễm", "Tiến bộ xã hội và bảo vệ môi trường"],
    2,
    "Luật Bảo vệ môi trường năm 2005 góp phần hoàn thiện nền tảng pháp lý cho phát triển bền vững.",
  ),
  20: q(
    "Đổi mới sáng tạo",
    "2006",
    "Điều gì giúp nâng cao sức cạnh tranh của nền kinh tế?",
    ["Chỉ dựa vào lao động giá rẻ", "Ứng dụng khoa học và công nghệ", "Hạn chế sáng tạo"],
    1,
    "Khoa học, công nghệ và đổi mới sáng tạo giúp nâng cao năng suất, chất lượng và sức cạnh tranh.",
  ),
  21: q(
    "Gia nhập WTO",
    "2007",
    "Việt Nam trở thành thành viên WTO vào năm nào?",
    ["2007", "1995", "1988"],
    0,
    "Ngày 11/1/2007, Việt Nam chính thức trở thành thành viên thứ 150 của Tổ chức Thương mại Thế giới.",
  ),
  22: q(
    "Kinh tế toàn cầu",
    "2008",
    "Khủng hoảng tài chính toàn cầu năm 2008 nhắc nhở điều gì?",
    ["Không cần dự phòng", "Hội nhập không có rủi ro", "Cần chủ động ứng phó các cú sốc bên ngoài"],
    2,
    "Hội nhập mang lại cơ hội nhưng cũng đòi hỏi khả năng chống chịu và chính sách ứng phó linh hoạt.",
  ),
  23: q(
    "An sinh xã hội",
    "2009",
    "Chính sách an sinh xã hội hướng đến ai?",
    [
      "Chỉ người có thu nhập cao",
      "Người dân, đặc biệt các nhóm dễ bị tổn thương",
      "Chỉ doanh nghiệp lớn",
    ],
    1,
    "An sinh xã hội hỗ trợ người dân trước rủi ro, góp phần giảm nghèo và bảo đảm tiến bộ, công bằng xã hội.",
  ),
  24: q(
    "Rủi ro quản trị",
    "2010",
    "Để hạn chế rủi ro quản trị, cần ưu tiên điều gì?",
    ["Minh bạch và trách nhiệm giải trình", "Che giấu thông tin", "Buông lỏng giám sát"],
    0,
    "Quản trị minh bạch, giám sát hiệu quả và trách nhiệm giải trình giúp sử dụng nguồn lực tốt hơn.",
  ),
  25: q(
    "Tái cơ cấu",
    "2011",
    "Tái cơ cấu kinh tế gắn với đổi mới mô hình tăng trưởng nhằm mục tiêu nào?",
    ["Chỉ tăng số lượng", "Hạn chế năng suất", "Nâng cao chất lượng và hiệu quả tăng trưởng"],
    2,
    "Đổi mới mô hình tăng trưởng chú trọng chất lượng, năng suất và hiệu quả thay vì chỉ mở rộng quy mô.",
  ),
  26: q(
    "Hiến pháp",
    "2013",
    "Hiến pháp năm 2013 khẳng định nền kinh tế Việt Nam là gì?",
    [
      "Kinh tế đóng cửa",
      "Kinh tế thị trường định hướng xã hội chủ nghĩa",
      "Kinh tế chỉ có một thành phần",
    ],
    1,
    "Hiến pháp năm 2013 khẳng định nền kinh tế thị trường định hướng xã hội chủ nghĩa với nhiều hình thức sở hữu, nhiều thành phần kinh tế.",
  ),
  27: q(
    "Cộng đồng ASEAN",
    "2015",
    "Sự hình thành Cộng đồng ASEAN cuối năm 2015 có ý nghĩa gì đối với Việt Nam?",
    [
      "Chấm dứt hợp tác khu vực",
      "Loại bỏ mọi thách thức kinh tế",
      "Tăng cường liên kết và hợp tác trong khu vực",
    ],
    2,
    "Cộng đồng ASEAN chính thức hình thành ngày 31/12/2015, mở ra giai đoạn liên kết sâu rộng hơn trên ba trụ cột: chính trị – an ninh, kinh tế và văn hóa – xã hội.",
  ),
  28: q(
    "Chỉnh đốn Đảng",
    "2016",
    "Xây dựng, chỉnh đốn Đảng gắn liền với yêu cầu nào?",
    ["Phòng, chống tham nhũng và suy thoái", "Giảm trách nhiệm cán bộ", "Bỏ qua giám sát"],
    0,
    "Xây dựng, chỉnh đốn Đảng nhằm nâng cao năng lực lãnh đạo, sức chiến đấu và củng cố niềm tin của nhân dân.",
  ),
  29: q(
    "Hội nhập mới",
    "2018",
    "Việc ký CPTPP năm 2018 thể hiện điều gì?",
    [
      "Rút khỏi thương mại quốc tế",
      "Đóng cửa thị trường",
      "Tiếp tục chủ động hội nhập kinh tế quốc tế",
    ],
    2,
    "CPTPP được ký năm 2018, mở thêm cơ hội hợp tác, đồng thời đặt ra yêu cầu nâng cao năng lực cạnh tranh.",
  ),
};
export const makeTeams = (count: number): Team[] =>
  Array.from({ length: count }, (_, i) => ({ id: i + 1, position: 1, score: 0, finished: false }));
const hasFinished = (team: Team) => team.finished || team.position >= 30;
export const getRaceWinner = (teams: Team[]) => teams.find(hasFinished);
export const landingPosition = (position: number, die: number) => Math.min(30, position + die);
export const rankTeams = (teams: Team[]) =>
  [...teams].sort(
    (a, b) =>
      Number(hasFinished(b)) - Number(hasFinished(a)) ||
      b.score - a.score ||
      b.position - a.position ||
      a.id - b.id,
  );
export function advanceTurn(teams: Team[], turn: number, round: number) {
  if (getRaceWinner(teams)) return { turn, round, ended: true };
  const next = (turn + 1) % teams.length;
  return { turn: next, round: round + (next === 0 ? 1 : 0), ended: false };
}
export const cellPoint = (n: number) => {
  const row = Math.floor((n - 1) / 6);
  const col = row % 2 ? 5 - ((n - 1) % 6) : (n - 1) % 6;
  return { x: col * 120 + 60, y: (4 - row) * 120 + 60 };
};
export function resolveAnswer(position: number, correct: boolean) {
  const ladder = !!LADDERS[position],
    snake = !!SNAKES[position];
  return {
    points: correct ? (ladder ? 100 : 80) : snake ? -40 : -20,
    destination:
      correct && ladder ? LADDERS[position] : !correct && snake ? SNAKES[position] : position,
    message: correct
      ? ladder
        ? "Leo thang!"
        : snake
          ? "Né được rắn!"
          : "Chính xác!"
      : snake
        ? "Bị rắn cắn!"
        : "Thêm một bài học!",
  };
}
