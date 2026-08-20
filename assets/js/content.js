/* =========================================================================
   Fah & Non — Wedding E-Card :: CONTENT CONFIG
   -------------------------------------------------------------------------
   ★ ข้อความทุกบรรทัดบนเว็บอยู่ในไฟล์นี้ไฟล์เดียว แก้ที่นี่ที่เดียวพอ
     ไม่ต้องไปแตะ index.html หรือ main.js เลย

   กติกาการแก้:
     - ข้อความอยู่ในเครื่องหมาย ' ' ให้แก้เฉพาะข้างในเครื่องหมาย
     - ถ้าในข้อความมีเครื่องหมาย ' ให้ใส่ \ ไว้ข้างหน้า เช่น 'it\'s'
     - บรรทัดที่ลงท้ายด้วย , ห้ามลบ , ทิ้ง
     - ค่าที่ชื่อลงท้ายว่า Html ใส่แท็ก HTML ได้ เช่น <br> <strong> <em>
     - {name} ในข้อความ = ระบบจะแทนด้วยชื่อแขกอัตโนมัติ
   ========================================================================= */

window.WEDDING = {

  /* ---------- ข้อมูลหน้าเว็บ / ตอนแชร์ลิงก์ ---------- */
  meta: {
    title:       'Fah & Non — 20 มีนาคม 2570',
    description: 'การ์ดเชิญงานมงคลสมรส ฟ้า & นนท์ — พิธีเช้า วันที่ 20 มีนาคม 2570 ณ วัดราชนัดดารามวรวิหาร กรุงเทพมหานคร',
    ogTitle:       'Fah & Non Wedding — 20 มีนาคม 2570',
    ogDescription: 'ด้วยความยินดี ขอเรียนเชิญร่วมเป็นเกียรติในพิธีมงคลสมรส ณ วัดราชนัดดารามวรวิหาร'
  },

  /* ---------- วัน–เวลางาน (ใช้กับนับถอยหลัง + ปุ่มบันทึกลงปฏิทิน) ---------- */
  event: {
    // เวลาไทย (+07:00) — 20 มีนาคม พ.ศ. 2570 = ค.ศ. 2027
    startISO: '2027-03-20T07:00:00+07:00',
    endISO:   '2027-03-20T12:00:00+07:00',

    calendarTitle:    'งานมงคลสมรส ฟ้า & นนท์ (Fah & Non Wedding)',
    calendarLocation: 'วัดราชนัดดารามวรวิหาร (โลหะปราสาท) ถนนมหาไชย เขตพระนคร กรุงเทพมหานคร',
    calendarDetails:
      'พิธีเช้า 07:00–12:00 น.\n' +
      'พิธีเจริญพระพุทธมนต์และตักบาตร · พิธีแห่ขันหมากและพิธีหมั้น · พิธีหลั่งน้ำพระพุทธมนต์ (09:39 น.) · ถวายภัตตาหารเพลและรับประทานอาหารร่วมกัน\n' +
      'Dress code: Dusty Blue & Sage Green (Thai Modern / Smart Casual)',
    calendarAlarm: 'พรุ่งนี้เช้า งานมงคลสมรส ฟ้า & นนท์'
  },

  /* ---------- โมโนแกรม (โลโก้ตรงกลางประตู) ---------- */
  monogram: { left: 'F', amp: '&', right: 'N' },

  /* ---------- หน้าแรก: ประตู ---------- */
  landing: {
    stageLabel: 'เปิดการ์ดเชิญ',
    tapLabel:   'แตะที่ตราสัญลักษณ์เพื่อเปิดการ์ดเชิญ'
  },

  /* ---------- ส่วนหัว / ชื่อบ่าวสาว ---------- */
  hero: {
    eyebrow:  'The Wedding Ceremony of',
    nameHtml: 'Fah <em>&amp;</em> Non',     // <em> = ตัว & สีทอง
    nameTh:   'ฟ้า & นนท์',
    leadEn:   'Together with their families, request the honor of your presence at their wedding celebration.',
    leadTh:   'ด้วยความยินดีอย่างยิ่ง ครอบครัวของเราขอเรียนเชิญท่าน ร่วมเป็นเกียรติและร่วมอนุโมทนาในพิธีมงคลสมรส',
    dateTh:   'วันเสาร์ที่ 20 มีนาคม 2570',
    dateEn:   'Saturday, 20 March 2027 · Morning Ceremony',
    scrollLabel: 'Scroll',
    scrollAria:  'เลื่อนลงเพื่อดูรายละเอียด'
  },

  /* ---------- นับถอยหลัง ---------- */
  countdown: {
    title:    'Counting Down',
    subtitle: 'นับถอยหลังสู่วันสำคัญของเรา',
    units: {
      days:    { th: 'วัน',      en: 'Days'    },
      hours:   { th: 'ชั่วโมง',  en: 'Hours'   },
      minutes: { th: 'นาที',     en: 'Minutes' },
      seconds: { th: 'วินาที',   en: 'Seconds' }
    },
    doneText:      'วันแห่งความทรงจำได้เริ่มขึ้นแล้ว ♡',
    googleBtn:     'Google Calendar',
    appleBtn:      'Apple Calendar (.ics)',
    icsFileName:   'fah-non-wedding.ics'
  },

  /* ---------- กำหนดการพิธี ---------- */
  schedule: {
    eyebrow:  'Order of Ceremony',
    title:    'กำหนดการพิธี',
    dateText: 'วันเสาร์ที่ 20 มีนาคม 2570',
    // เพิ่ม/ลบรายการได้ตามต้องการ  highlight: true = ไฮไลต์เป็นสีทอง (ฤกษ์มงคล)
    items: [
      { time: '07:00', unit: 'น.', title: 'พิธีเจริญพระพุทธมนต์ และตักบาตรพระสงฆ์',
        note: 'Buddhist Chanting & Alms Offering' },
      { time: '08:30', unit: 'น.', title: 'พิธีแห่ขันหมาก และพิธีหมั้น',
        note: 'Khan Maak Procession & Engagement Ceremony' },
      { time: '09:39', unit: 'น.', title: 'พิธีหลั่งน้ำพระพุทธมนต์ (รดน้ำสังข์)',
        note: 'Water Blessing Ceremony · ฤกษ์มงคล', highlight: true },
      { time: '11:00', unit: 'น.', title: 'ถวายภัตตาหารเพลแด่พระสงฆ์ และรับประทานอาหารร่วมกัน',
        note: 'Luncheon Offering · Coffee Break & Light Buffet' },
      { time: '12:00', unit: 'น.', title: 'เสร็จสิ้นพิธีการ',
        note: 'End of Ceremony' }
    ]
  },

  /* ---------- สถานที่ ---------- */
  venue: {
    eyebrow: 'The Venue',
    nameTh:  'วัดราชนัดดารามวรวิหาร',
    nameEn:  'Wat Ratchanaddaram Voraviharn · Bangkok',
    addressHtml:
      'วัดราชนัดดารามวรวิหาร (โลหะปราสาท)<br>' +
      'ถนนมหาไชย แขวงบ้านบาตร เขตพระนคร กรุงเทพมหานคร 10200',
    artAlt:  'ภาพลายเส้นโลหะปราสาท วัดราชนัดดารามวรวิหาร',
    mapsBtn: 'Open Google Maps',
    // เปลี่ยนเป็นลิงก์ Google Maps ของสถานที่จริงได้เลย
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' +
             encodeURIComponent('วัดราชนัดดารามวรวิหาร')
  },

  /* ---------- ข้อมูลสำหรับแขก ---------- */
  info: {
    eyebrow: 'Guest Information',
    title:   'ข้อมูลสำหรับแขกผู้มีเกียรติ',

    dress: {
      title:    'Dress Code',
      subtitle: 'Dusty Blue & Sage Green',
      textHtml: 'ธีมการแต่งกาย: <strong>Thai Modern / Smart Casual</strong><br>' +
                'ขอความกรุณาแต่งกายในโทนสีฟ้าหม่นหรือเขียวเสจ เพื่อความงดงามกลมกลืนในภาพความทรงจำของเรา',
      // วงกลมตัวอย่างสี — เพิ่ม/ลบได้
      swatches: ['#8A9EA7', '#B5C4CA', '#8F9E8B', '#BCC7B8', '#F4EFE6', '#D4AF37'],
      note: 'หมายเหตุ: เนื่องจากเป็นพิธีภายในพระอาราม ขอความกรุณางดกางเกงขาสั้น กระโปรงสั้น และเสื้อสายเดี่ยว'
    },

    parking: {
      title:    'Parking',
      subtitle: 'ที่จอดรถ & การเดินทาง',
      itemsHtml: [
        '<strong>ลานพลับพลามหาเจษฎาบดินทร์</strong> — ติดกับวัด เดินถึงศาลาพิธีประมาณ 2 นาที (ที่จอดจำกัด แนะนำให้มาก่อนเวลา)',
        '<strong>ลานจอดรถวัดสระเกศ (ภูเขาทอง)</strong> — ห่างประมาณ 700 เมตร มีพื้นที่รองรับมากกว่า',
        '<strong>อาคารจอดรถบริเวณถนนมหาไชย / ตลาดนางเลิ้ง</strong> — สำรองในกรณีลานจอดเต็ม',
        '<strong>MRT สายสีม่วงใต้ สถานีสามยอด</strong> และรถสาธารณะ — สะดวกที่สุดในช่วงเช้าวันหยุด'
      ],
      note: 'พิธีเริ่มเวลา 07:00 น. ขอความกรุณามาถึงก่อนเวลาประมาณ 20 นาที'
    }
  },

  /* ---------- ฟอร์มตอบรับ ---------- */
  rsvp: {
    // ★ เปิด/ปิดทั้งส่วนตอบรับ  false = ซ่อน section นี้ไปเลยทั้งอัน
    enabled: true,

    // ★ เปิด/ปิดทีละช่องกรอก  false = ไม่ต้องถามข้อนั้น
    fields: {
      guestCount: true,   // จำนวนผู้ร่วมงาน
      slots:      true,   // ช่วงพิธีที่สะดวกร่วม
      wishes:     true    // คำอวยพร
    },

    eyebrow:  'R.S.V.P.',
    title:    'ตอบรับคำเชิญ',
    deadline: 'กรุณาตอบรับภายในวันที่ 28 กุมภาพันธ์ 2570',

    // ว่างไว้ = เก็บลงเครื่องแขก + ให้กดคัดลอกข้อความส่งให้บ่าวสาว
    // ใส่ URL ที่รับ JSON POST (เช่น Google Apps Script) = ส่งเข้าระบบอัตโนมัติ
    endpoint: '',

    labels: {
      name:             'ชื่อ–นามสกุลผู้ตอบรับ',
      nameEn:           'Guest Name',
      namePlaceholder:  'เช่น คุณสมชาย ใจดี',
      attendance:       'การเข้าร่วม',
      attendanceEn:     'Attendance Status',
      guests:           'จำนวนผู้ร่วมงาน',
      guestsEn:         'Number of Guests',
      guestsMax:        10,
      slot:             'ช่วงพิธีที่ท่านสะดวกร่วม',
      slotEn:           'Attendance Slot',
      wishes:           'คำอวยพรถึงบ่าวสาว',
      wishesEn:         'Wishes (optional)',
      wishesPlaceholder:'เขียนคำอวยพรสั้น ๆ ถึงเรา…',
      submit:           'ส่งคำตอบรับ · Send RSVP',
      submitting:       'กำลังส่ง…',
      privacy:          'ข้อมูลของท่านจะถูกใช้เพื่อการเตรียมงานเท่านั้น'
    },

    attendance: [
      { value: 'attending', title: 'ยินดีเข้าร่วม',            note: 'Joyfully Attending'  },
      { value: 'declined',  title: 'ไม่สามารถเข้าร่วมได้',      note: 'Regretfully Decline' }
    ],

    slots: [
      { value: 'morning-monk',  title: 'ร่วมพิธีทำบุญตักบาตร (07:00 น.)', note: 'Joining Morning Monk Ceremony' },
      { value: 'morning-water', title: 'ร่วมพิธีรดน้ำสังข์ (09:39 น.)',    note: 'Joining Morning Water Pouring' }
    ],

    errors: {
      name:       'กรุณากรอกชื่อของท่าน',
      attendance: 'กรุณาเลือกสถานะการเข้าร่วม',
      slot:       'กรุณาเลือกอย่างน้อย 1 ช่วงพิธี'
    },

    thanks: {
      titleAttending: 'ขอบพระคุณอย่างสูง',
      titleDeclined:  'ขอบพระคุณสำหรับคำตอบ',
      textAttending:  'เราได้รับคำตอบรับของ {name} เรียบร้อยแล้ว\nแล้วพบกันเช้าวันที่ 20 มีนาคม 2570 ณ วัดราชนัดดารามวรวิหาร',
      textDeclined:   'เสียดายที่ไม่ได้พบกัน แต่เราขอบคุณสำหรับความปรารถนาดีของ {name} เสมอ',
      copyBtn:        'คัดลอกข้อความตอบรับ',
      editBtn:        'แก้ไขคำตอบ',
      copied:         'คัดลอกแล้ว — ส่งต่อให้บ่าวสาวทาง LINE ได้เลย',
      copyFailed:     'คัดลอกไม่สำเร็จ กรุณาคัดลอกด้วยตนเอง'
    },

    // ข้อความที่ถูกคัดลอกเมื่อกดปุ่ม "คัดลอกข้อความตอบรับ"
    summary: {
      header:     'ตอบรับงานมงคลสมรส ฟ้า & นนท์ · 20 มีนาคม 2570',
      name:       'ชื่อ',
      status:     'สถานะ',
      attending:  'ยินดีเข้าร่วม',
      declined:   'ไม่สามารถเข้าร่วมได้',
      guests:     'จำนวนผู้ร่วมงาน',
      guestsUnit: 'ท่าน',
      slots:      'ช่วงพิธี',
      wishes:     'คำอวยพร'
    }
  },

  /* ---------- ท้ายการ์ด ---------- */
  footer: {
    th:   'ด้วยรักและความปรารถนาดี',
    en:   'With love and gratitude · Fah & Non',
    date: '20 . 03 . 2570'
  },

  /* ---------- เพลงประกอบ ---------- */
  music: {
    src:    'assets/audio/ambient.mp3',   // ไม่มีไฟล์ = ปุ่มเพลงจะซ่อนอัตโนมัติ
    volume: 0.35,
    label:  'เปิด/ปิดเสียงเพลงประกอบ'
  }
};
