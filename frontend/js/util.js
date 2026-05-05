// Shared util — tier classification and formatters
function tierClass(score) {
  if (score == null) return 'tier-5';
  if (score >= 700) return 'tier-1';
  if (score >= 680) return 'tier-2';
  if (score >= 660) return 'tier-3';
  if (score >= 640) return 'tier-4';
  return 'tier-5';
}
function tierLabel(score) {
  if (score == null) return '—';
  if (score >= 700) return '四校级';
  if (score >= 680) return '强市重点';
  if (score >= 660) return '市重点';
  if (score >= 640) return '区重点';
  return '普通高中';
}
function fmtScore(s) {
  if (s == null) return '—';
  return Number.isInteger(s) ? s + ' 分' : s.toFixed(1) + ' 分';
}
function tierBorder(score) {
  if (score == null) return '#9ca3af';
  if (score >= 700) return '#1e3a8a';
  if (score >= 680) return '#1a56db';
  if (score >= 660) return '#0694a2';
  return '#9ca3af';
}
const SH_DISTRICTS = ['黄浦','徐汇','长宁','静安','普陀','虹口','杨浦','闵行','宝山','嘉定','浦东','金山','松江','青浦','奉贤','崇明'];

// 一分一段表（模拟数据，用于排名估算）
const PUDONG_RANK = {
  720:1, 715:5, 710:15, 706:40, 705:50, 700:145,
  699:175, 698:210, 697:250, 696:295, 695:340,
  694:390, 693:445, 692:505, 691:570, 690:640,
  689:720, 688:800, 687:890, 686:985, 685:1085,
  684:1190, 683:1300, 682:1420, 681:1545, 680:1675,
  679:1810, 678:1955, 677:2105, 676:2260, 675:2420,
  674:2590, 673:2770, 672:2960, 670:3370, 665:4570,
  660:6020, 655:7600, 650:9300, 640:13000, 630:17000,
  620:21000, 600:29000, 580:35000,
};
const CITY_RANK = {
  720:5, 715:30, 710:100, 706:250, 705:310, 700:800,
  699:950, 698:1120, 697:1310, 696:1520, 695:1750,
  694:2000, 693:2270, 692:2560, 691:2870, 690:3200,
  689:3560, 688:3950, 687:4370, 686:4820, 685:5300,
  684:5810, 683:6350, 682:6920, 681:7530, 680:8180,
  679:8870, 678:9600, 677:10370, 676:11180, 675:12030,
  674:12920, 673:13860, 672:14850, 670:16980, 665:22500,
  660:28500, 655:35000, 650:42000, 640:52000, 630:60000,
  620:66000, 600:75000, 580:80000,
};
function estimateRank(score, table) {
  const keys = Object.keys(table).map(Number).sort((a,b) => b - a);
  if (score >= keys[0]) return table[keys[0]];
  if (score <= keys[keys.length-1]) return table[keys[keys.length-1]];
  for (let i = 0; i < keys.length - 1; i++) {
    if (score <= keys[i] && score >= keys[i+1]) {
      const hi = keys[i], lo = keys[i+1];
      const pct = (hi - score) / (hi - lo);
      return Math.round(table[hi] + pct * (table[lo] - table[hi]));
    }
  }
  return table[keys[keys.length-1]];
}

function useDebounce(value, delay) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

window.useDebounce = useDebounce;
window.tierClass = tierClass;
window.tierLabel = tierLabel;
window.fmtScore = fmtScore;
window.tierBorder = tierBorder;
window.SH_DISTRICTS = SH_DISTRICTS;
window.PUDONG_RANK = PUDONG_RANK;
window.CITY_RANK = CITY_RANK;
window.estimateRank = estimateRank;
