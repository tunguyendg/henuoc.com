/**
 * Wedding invitation wording for the free tool `/cong-cu/mau-loi-moi-dam-cuoi`.
 *
 * - Templates use `{variable}` slots; only names in `invitationVariables` are allowed
 *   (`invitation-templates.test.ts` enforces this).
 * - Empty slots render as a readable placeholder ("[ngày cưới]") so the user sees what is missing.
 * - Wording follows common Vietnamese etiquette; keep it neutral across regions, no invented facts.
 */

export const invitationVariables = [
  "tenKhach",
  "chuRe",
  "coDau",
  "ngay",
  "gio",
  "diaDiem",
  "link",
] as const;

export type InvitationVariable = (typeof invitationVariables)[number];

export type InvitationValues = Partial<Record<InvitationVariable, string>>;

export const invitationFields: Record<
  InvitationVariable,
  { label: string; placeholder: string; example: string }
> = {
  tenKhach: { label: "Tên khách", placeholder: "[tên khách]", example: "bác Hùng, chị Lan…" },
  chuRe: { label: "Tên chú rể", placeholder: "[tên chú rể]", example: "Hoàng Nam" },
  coDau: { label: "Tên cô dâu", placeholder: "[tên cô dâu]", example: "Minh Anh" },
  ngay: { label: "Ngày cưới", placeholder: "[ngày cưới]", example: "Chủ nhật, 20/12/2026" },
  gio: { label: "Giờ đón khách", placeholder: "[giờ]", example: "11 giờ trưa" },
  diaDiem: { label: "Địa điểm", placeholder: "[địa điểm]", example: "Nhà hàng Hoa Sen, Q.3" },
  link: { label: "Link thiệp online", placeholder: "[link thiệp]", example: "Dán link thiệp" },
};

export interface InvitationTemplate {
  id: string;
  text: string;
}

export interface InvitationStyle {
  id: string;
  label: string;
  description: string;
  templates: readonly InvitationTemplate[];
}

export const invitationStyles: readonly InvitationStyle[] = [
  {
    id: "trang-trong",
    label: "Trang trọng, gửi người lớn",
    description: "Cho ông bà, cô chú, bác, thầy cô và khách của bố mẹ. Lời lẽ lễ phép, đầy đủ.",
    templates: [
      {
        id: "trang-trong-1",
        text: "Kính thưa {tenKhach}, chúng con là {chuRe} và {coDau} xin trân trọng kính mời {tenKhach} đến dự tiệc cưới của chúng con vào lúc {gio}, {ngay}, tại {diaDiem}. Sự hiện diện của {tenKhach} là niềm vinh hạnh lớn đối với hai gia đình.",
      },
      {
        id: "trang-trong-2",
        text: "Kính gửi {tenKhach}, gia đình chúng tôi xin báo tin vui: hai cháu {chuRe} và {coDau} sẽ tổ chức lễ thành hôn. Trân trọng kính mời {tenKhach} đến dự tiệc cưới vào lúc {gio}, {ngay}, tại {diaDiem}. Rất mong được đón tiếp {tenKhach}.",
      },
      {
        id: "trang-trong-3",
        text: "Trân trọng kính mời {tenKhach} tới dự bữa tiệc chung vui cùng gia đình chúng tôi nhân ngày thành hôn của {chuRe} và {coDau}. Tiệc được tổ chức vào lúc {gio}, {ngay}, tại {diaDiem}. Sự có mặt của {tenKhach} là niềm vui của gia đình.",
      },
    ],
  },
  {
    id: "than-mat",
    label: "Thân mật, bạn bè",
    description: "Cho bạn thân, bạn học, hội nhóm. Vui vẻ, gần gũi như nói chuyện hằng ngày.",
    templates: [
      {
        id: "than-mat-1",
        text: "{tenKhach} ơi, cuối cùng ngày này cũng tới! {chuRe} và {coDau} chính thức về chung một nhà rồi. Tiệc cưới lúc {gio}, {ngay}, tại {diaDiem}. Nhất định phải tới chung vui với tụi mình nha!",
      },
      {
        id: "than-mat-2",
        text: "Gửi {tenKhach}, {chuRe} và {coDau} sắp cưới rồi nè! Hẹn {tenKhach} lúc {gio}, {ngay}, ở {diaDiem}. Có {tenKhach} thì đám cưới mới trọn vẹn, nhớ đến sớm để chụp ảnh cùng tụi mình nhé.",
      },
      {
        id: "than-mat-3",
        text: "Thân mời {tenKhach} đến ăn cưới {chuRe} và {coDau}! Tiệc lúc {gio}, {ngay}, tại {diaDiem}. Không cần gì nhiều, chỉ cần {tenKhach} có mặt là tụi mình vui lắm rồi.",
      },
    ],
  },
  {
    id: "dong-nghiep",
    label: "Đồng nghiệp, đối tác",
    description: "Cho sếp, đồng nghiệp, khách hàng. Lịch sự, rõ ràng, không quá suồng sã.",
    templates: [
      {
        id: "dong-nghiep-1",
        text: "Chào {tenKhach}, mình xin báo tin vui: {chuRe} và {coDau} sẽ tổ chức tiệc cưới vào lúc {gio}, {ngay}, tại {diaDiem}. Rất mong {tenKhach} sắp xếp thời gian đến chung vui cùng chúng mình.",
      },
      {
        id: "dong-nghiep-2",
        text: "Thân gửi {tenKhach}, nhân dịp lễ thành hôn của {chuRe} và {coDau}, mình trân trọng mời {tenKhach} đến dự tiệc cưới lúc {gio}, {ngay}, tại {diaDiem}. Cảm ơn {tenKhach} đã luôn đồng hành cùng mình trong công việc, rất mong được đón {tenKhach} hôm ấy.",
      },
    ],
  },
  {
    id: "zalo-ngan",
    label: "Tin nhắn Zalo ngắn",
    description: "Gửi nhanh qua Zalo, Messenger. Ngắn gọn, đủ ngày giờ, địa điểm.",
    templates: [
      {
        id: "zalo-ngan-1",
        text: "{tenKhach} ơi, {chuRe} và {coDau} cưới vào {ngay}, tiệc lúc {gio} tại {diaDiem}. Mời {tenKhach} đến chung vui nhé!",
      },
      {
        id: "zalo-ngan-2",
        text: "Mời {tenKhach} dự tiệc cưới {chuRe} & {coDau}: {gio}, {ngay}, tại {diaDiem}. Hẹn gặp {tenKhach} nha!",
      },
      {
        id: "zalo-ngan-3",
        text: "Tin vui nè {tenKhach}: tụi mình cưới vào {ngay}! Tiệc lúc {gio} ở {diaDiem}, mong {tenKhach} đến chung vui cùng {chuRe} và {coDau}.",
      },
    ],
  },
  {
    id: "kem-link",
    label: "Mời kèm link thiệp online",
    description:
      "Lời nhắn đi kèm đường link thiệp cưới online, khách bấm vào xem bản đồ và xác nhận.",
    templates: [
      {
        id: "kem-link-1",
        text: "Gửi {tenKhach}, {chuRe} và {coDau} xin mời {tenKhach} đến dự tiệc cưới lúc {gio}, {ngay}, tại {diaDiem}. Thiệp mời có đủ bản đồ đường đi, {tenKhach} mở ở đây nhé: {link}",
      },
      {
        id: "kem-link-2",
        text: "Kính mời {tenKhach} đến dự lễ thành hôn của {chuRe} và {coDau} vào lúc {gio}, {ngay}, tại {diaDiem}. Thiệp mời online gửi {tenKhach}: {link}. Nếu tiện, {tenKhach} bấm xác nhận tham dự trên thiệp giúp chúng tôi.",
      },
    ],
  },
];

const SLOT = /\{(\w+)\}/g;

function isInvitationVariable(name: string): name is InvitationVariable {
  return (invitationVariables as readonly string[]).includes(name);
}

/** Every `{slot}` name used in a template, in order of appearance. */
export function templateSlots(template: string): string[] {
  return Array.from(template.matchAll(SLOT), (m) => m[1] ?? "");
}

/**
 * Fill `{slot}`s with trimmed values. Empty or missing values become the field placeholder
 * ("[ngày cưới]"); unknown slots are left untouched so mistakes stay visible.
 */
export function renderInvitation(template: string, values: InvitationValues): string {
  return template.replace(SLOT, (whole, name: string) => {
    if (!isInvitationVariable(name)) return whole;
    const value = values[name]?.trim();
    return value ? value : invitationFields[name].placeholder;
  });
}
