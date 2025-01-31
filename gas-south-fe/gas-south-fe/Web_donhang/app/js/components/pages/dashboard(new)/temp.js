export const excelTable = (props) => ({
  header: [
    {
      cell: "A1",
      range: "A1:A3",
      value: "STT",
    },
    {
      cell: "B1",
      range: "B1:B3",
      value: "Mã KH",
    },
    {
      cell: "C1",
      range: "C1:C3",
      value: "Tên KH",
    },
    {
      cell: "D1",
      range: "D1:E1",
      value: props.Month,
    },
    {
      cell: "F1",
      range: "F1:K1",
      value: props.toMonth,
    },
    {
      cell: "L1",
      range: "L1:N1",
      value: "Tỉ lệ %",
    },
    {
      cell: "O1",
      range: "",
      value: "Khu vực",
    },
    {
      cell: "P1",
      range: "",
      value: "Loại KH",
    },
    {
      cell: "D2",
      range: "",
      value: `SLTH\n${props.Month}`,
    },
    {
      cell: "E2",
      range: "",
      value: `TH lũy kế đến\n${props.Date}`,
    },
    {
      cell: "F2",
      range: "",
      value: `SLTH\n${props.toMonth}`,
    },
    {
      cell: "G2",
      range: "",
      value: "Lũy kế B6",
    },
    {
      cell: "H2",
      range: "",
      value: "Lũy kế B12",
    },
    {
      cell: "I2",
      range: "",
      value: "Lũy kế B20",
    },
    {
      cell: "J2",
      range: "",
      value: "Lũy kế B45",
    },
    {
      cell: "K2",
      range: "",
      value: `TH lũy kế đến\n${props.toDate}`,
    },
    {
      cell: "L2",
      range: "",
      value: "% lũy kế TH/KH",
    },
    {
      cell: "M2",
      range: "",
      value: "(+/-) cùng kỳ tháng trước",
    },
    {
      cell: "N2",
      range: "",
      value: "% tăng trưởng/tháng",
    },
    {
      cell: "D3",
      range: "",
      value: "'(1)",
    },
    {
      cell: "E3",
      range: "",
      value: "'(2)",
    },
    {
      cell: "F3",
      range: "",
      value: "'(3)",
    },
    {
      cell: "K3",
      range: "",
      value: "'(4)",
    },
    {
      cell: "L3",
      range: "",
      value: "'(5=4/3)",
    },
    {
      cell: "M3",
      range: "",
      value: "'(6=4/2)",
    },
    {
      cell: "N3",
      range: "",
      value: "'(7=3/1)",
    },
  ],
  body: [
    
  ]
});
