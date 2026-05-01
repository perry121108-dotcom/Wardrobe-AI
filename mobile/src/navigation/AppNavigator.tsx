import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = { onLogout: () => void };
type TabKey = 'wardrobe' | 'recommend' | 'records' | 'profile';
type SeasonKey = 'spring' | 'summer' | 'autumn' | 'winter';
type ColorSeasonKey =
  | 'bright_spring' | 'true_spring' | 'light_spring'
  | 'light_summer' | 'true_summer' | 'soft_summer'
  | 'soft_autumn' | 'true_autumn' | 'deep_autumn'
  | 'deep_winter' | 'true_winter' | 'bright_winter';
type SkinToneKey = 'cool_white' | 'warm_yellow' | 'wheat_tan' | 'neutral';
type BodyTypeKey = 'upper_heavy' | 'pear_shape' | 'balanced';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'wardrobe', label: '衣櫥', icon: '👗' },
  { key: 'recommend', label: '推薦', icon: '✨' },
  { key: 'records', label: '紀錄', icon: '📋' },
  { key: 'profile', label: '設定', icon: '👤' },
];

const categories = ['全部', '上衣', '外套', '下身', '配件'];

const occasions = [
  { key: 'work_interview', label: '面試 / 初見客戶', goal: '信任、穩定、可靠' },
  { key: 'work_presentation', label: '高層演說', goal: '專業、清晰、有份量' },
  { key: 'work_creative', label: '創意提案', goal: '個性展現' },
  { key: 'work_daily', label: '日常辦公', goal: '俐落、低負擔' },
  { key: 'date_first', label: '初次約會', goal: '親近、柔和' },
  { key: 'date_casual', label: '輕鬆約會', goal: '自然、放鬆' },
  { key: 'casual', label: '日常休閒', goal: '舒適、生活感' },
  { key: 'outdoor', label: '戶外活動', goal: '機能、明亮' },
  { key: 'party', label: '派對 / 宴會', goal: '記憶點' },
  { key: 'sport', label: '運動', goal: '輕量、活動性' },
];

const seasons: { key: SeasonKey; label: string; icon: string }[] = [
  { key: 'spring', label: '春', icon: '🌸' },
  { key: 'summer', label: '夏', icon: '☀️' },
  { key: 'autumn', label: '秋', icon: '🍂' },
  { key: 'winter', label: '冬', icon: '❄️' },
];

const colorSeasons: { key: ColorSeasonKey; label: string; desc: string; bg: string }[] = [
  { key: 'bright_spring', label: '亮春', desc: '明亮清透，高彩度', bg: '#FFF4B8' },
  { key: 'true_spring', label: '純春', desc: '溫暖鮮明，活力色', bg: '#FFE8A3' },
  { key: 'light_spring', label: '淡春', desc: '明亮柔和，低對比', bg: '#FFF7D7' },
  { key: 'light_summer', label: '淡夏', desc: '冷白柔霧，低彩度', bg: '#EEF2FF' },
  { key: 'true_summer', label: '純夏', desc: '冷調柔霧，中低對比', bg: '#EAF0FF' },
  { key: 'soft_summer', label: '柔夏', desc: '灰霧冷色，柔和感', bg: '#ECEAF5' },
  { key: 'soft_autumn', label: '柔秋', desc: '霧面暖色，低對比', bg: '#F3DDC2' },
  { key: 'true_autumn', label: '純秋', desc: '大地暖色，中對比', bg: '#FFD27A' },
  { key: 'deep_autumn', label: '深秋', desc: '濃厚暖色，高對比', bg: '#E1B06E' },
  { key: 'deep_winter', label: '深冬', desc: '深沉冷色，高對比', bg: '#C7B3F2' },
  { key: 'true_winter', label: '純冬', desc: '冷冽清晰，高反差', bg: '#E7ECFF' },
  { key: 'bright_winter', label: '亮冬', desc: '冷亮高彩，銳利感', bg: '#E8F8FF' },
];

const skinTones: { key: SkinToneKey; label: string }[] = [
  { key: 'cool_white', label: '冷白' },
  { key: 'warm_yellow', label: '暖黃' },
  { key: 'wheat_tan', label: '小麥' },
  { key: 'neutral', label: '中性' },
];

const bodyTypes: { key: BodyTypeKey; label: string; desc: string }[] = [
  { key: 'upper_heavy', label: '上重型', desc: '肩寬或上身較豐滿' },
  { key: 'pear_shape', label: '梨型', desc: '臀部或大腿較寬' },
  { key: 'balanced', label: '均衡型', desc: '上下比例接近' },
];

const paletteBySeason: Record<ColorSeasonKey, {
  name: string;
  colors: { slot: string; icon: string; label: string; hex: string }[];
  reason: string;
}> = {
  bright_spring: {
    name: '明亮春型',
    colors: [
      { slot: '外套', icon: '🧥', label: '清澈藍綠薄外套 / 罩衫', hex: '#40B3A2' },
      { slot: '上衣', icon: '👕', label: '純白 T 恤 / 上衣', hex: '#FFFFFF' },
      { slot: '下身', icon: '👖', label: '活力珊瑚橘褲子', hex: '#FF6B35' },
      { slot: '配件', icon: '👜', label: '熱帶粉配件', hex: '#FF69B4' },
    ],
    reason: '根據你的明亮春型色季特性，搭配日常休閒場合與春季，以下四個顏色是最能展現你魅力的基礎款。',
  },
  true_autumn: {
    name: '純秋',
    colors: [
      { slot: '外套', icon: '🧥', label: '橄欖綠外套 / 亞麻罩衫', hex: '#6F7F3F' },
      { slot: '上衣', icon: '👕', label: '暖象牙白上衣', hex: '#F4E3C1' },
      { slot: '下身', icon: '👖', label: '焦糖棕直筒褲', hex: '#C47A3B' },
      { slot: '配件', icon: '👜', label: '銅棕皮革配件', hex: '#A45A2A' },
    ],
    reason: '根據你的純秋色季特性，溫暖大地色能穩定比例並提升整體質感。',
  },
  deep_winter: {
    name: '深冬',
    colors: [
      { slot: '外套', icon: '🧥', label: '深海軍藍長外套', hex: '#182A4D' },
      { slot: '上衣', icon: '👕', label: '冷白襯衫 / 針織', hex: '#F8FAFF' },
      { slot: '下身', icon: '👖', label: '炭黑高腰褲', hex: '#202020' },
      { slot: '配件', icon: '👜', label: '酒紅亮面配件', hex: '#7B1E3A' },
    ],
    reason: '根據你的深冬色季特性，深冷色與高對比最能保留氣場與線條俐落感。',
  },
  true_spring: {
    name: '純春',
    colors: [
      { slot: '外套', icon: '🧥', label: '杏桃色薄外套', hex: '#FFB36B' },
      { slot: '上衣', icon: '👕', label: '奶油白上衣', hex: '#FFF7E1' },
      { slot: '下身', icon: '👖', label: '亮卡其褲', hex: '#C9A45C' },
      { slot: '配件', icon: '👜', label: '番茄紅小包', hex: '#F04A3A' },
    ],
    reason: '純春適合暖亮、乾淨、有精神的配色，避免太灰的色彩讓氣色被壓低。',
  },
  light_spring: {
    name: '淡春',
    colors: [
      { slot: '外套', icon: '🧥', label: '淡蜜桃罩衫', hex: '#FFD6C2' },
      { slot: '上衣', icon: '👕', label: '暖白上衣', hex: '#FFF8EA' },
      { slot: '下身', icon: '👖', label: '淺駝直筒褲', hex: '#D8B98F' },
      { slot: '配件', icon: '👜', label: '柔珊瑚配件', hex: '#FF9C8A' },
    ],
    reason: '淡春需要明亮但不要過重的色彩，讓整體保留輕盈和親和感。',
  },
  light_summer: {
    name: '淡夏',
    colors: [
      { slot: '外套', icon: '🧥', label: '霧藍薄外套', hex: '#B7CFE8' },
      { slot: '上衣', icon: '👕', label: '冷白上衣', hex: '#F7F8FF' },
      { slot: '下身', icon: '👖', label: '淡灰紫長褲', hex: '#B9B2CC' },
      { slot: '配件', icon: '👜', label: '玫瑰粉配件', hex: '#D8A8C5' },
    ],
    reason: '淡夏適合冷調、柔霧、低對比配色，能讓氣質更清爽乾淨。',
  },
  true_summer: {
    name: '純夏',
    colors: [
      { slot: '外套', icon: '🧥', label: '灰藍外套', hex: '#7895B2' },
      { slot: '上衣', icon: '👕', label: '月光白上衣', hex: '#F1F3FA' },
      { slot: '下身', icon: '👖', label: '霧灰直筒褲', hex: '#9AA0A6' },
      { slot: '配件', icon: '👜', label: '莓果粉配件', hex: '#B76E8B' },
    ],
    reason: '純夏用冷柔中彩度最穩，避免過暖黃與高飽和螢光色。',
  },
  soft_summer: {
    name: '柔夏',
    colors: [
      { slot: '外套', icon: '🧥', label: '霧鼠尾草外套', hex: '#9AAE9A' },
      { slot: '上衣', icon: '👕', label: '灰白針織', hex: '#E8E8E5' },
      { slot: '下身', icon: '👖', label: '霧紫灰褲', hex: '#9E94A8' },
      { slot: '配件', icon: '👜', label: '乾燥玫瑰配件', hex: '#B48A9A' },
    ],
    reason: '柔夏最怕太亮太硬，灰霧色能把整體變得精緻而自然。',
  },
  soft_autumn: {
    name: '柔秋',
    colors: [
      { slot: '外套', icon: '🧥', label: '苔綠亞麻外套', hex: '#8A8F63' },
      { slot: '上衣', icon: '👕', label: '燕麥色上衣', hex: '#D9C7A7' },
      { slot: '下身', icon: '👖', label: '可可棕長褲', hex: '#9A6B4F' },
      { slot: '配件', icon: '👜', label: '陶土橘配件', hex: '#C87554' },
    ],
    reason: '柔秋適合霧面暖色，避免過亮黑白讓臉部變硬。',
  },
  deep_autumn: {
    name: '深秋',
    colors: [
      { slot: '外套', icon: '🧥', label: '深橄欖綠外套', hex: '#3F4A2D' },
      { slot: '上衣', icon: '👕', label: '暖米白上衣', hex: '#EFE0C2' },
      { slot: '下身', icon: '👖', label: '咖啡棕寬褲', hex: '#5C3727' },
      { slot: '配件', icon: '👜', label: '鐵鏽紅配件', hex: '#9B3D24' },
    ],
    reason: '深秋能承受厚重暖色，高對比但不冷硬的配色會更有份量。',
  },
  true_winter: {
    name: '純冬',
    colors: [
      { slot: '外套', icon: '🧥', label: '正黑俐落外套', hex: '#111111' },
      { slot: '上衣', icon: '👕', label: '冷白襯衫', hex: '#FFFFFF' },
      { slot: '下身', icon: '👖', label: '冰灰直筒褲', hex: '#C7CDD8' },
      { slot: '配件', icon: '👜', label: '寶石藍配件', hex: '#0057B8' },
    ],
    reason: '純冬適合清楚邊界與冷調高對比，黑白灰加寶石色會很穩。',
  },
  bright_winter: {
    name: '亮冬',
    colors: [
      { slot: '外套', icon: '🧥', label: '亮鈷藍外套', hex: '#005BFF' },
      { slot: '上衣', icon: '👕', label: '冷白上衣', hex: '#FFFFFF' },
      { slot: '下身', icon: '👖', label: '黑色合身長褲', hex: '#161616' },
      { slot: '配件', icon: '👜', label: '亮粉紅配件', hex: '#FF2FB3' },
    ],
    reason: '亮冬需要冷亮、清晰、高彩度的點綴，能讓整體更有記憶點。',
  },
};

function Page({ children }: { children: React.ReactNode }) {
  return <ScrollView contentContainerStyle={styles.page}>{children}</ScrollView>;
}

function Chip({
  label,
  sub,
  selected,
  onPress,
}: {
  label: string;
  sub?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.chip, selected && styles.chipActive]}
      onPress={onPress}
    >
      <Text style={[styles.chipLabel, selected && styles.chipLabelActive]}>{label}</Text>
      {selected && sub ? <Text style={styles.chipSub}>{sub}</Text> : null}
    </TouchableOpacity>
  );
}

function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <View style={styles.sectionTitleWrap}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {sub ? <Text style={styles.sectionSub}>{sub}</Text> : null}
    </View>
  );
}

function WardrobeScreen() {
  const [category, setCategory] = useState('全部');

  return (
    <View style={styles.fixedScreen}>
      <View style={styles.screenHead}>
        <Text style={styles.bigTitle}>我的衣櫥</Text>
        <Text style={styles.countText}>0 件</Text>
      </View>
      <View style={styles.categoryRow}>
        {categories.map(item => (
          <TouchableOpacity
            key={item}
            style={[styles.categoryPill, category === item && styles.categoryPillActive]}
            onPress={() => setCategory(item)}
          >
            <Text style={[styles.categoryText, category === item && styles.categoryTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>衣櫥是空的，點擊 + 新增第一件衣物</Text>
      </View>
      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

function ColorGuide({
  colorSeason,
  selectedOccasion,
  selectedSeason,
  bodyType,
}: {
  colorSeason: ColorSeasonKey;
  selectedOccasion: string;
  selectedSeason: SeasonKey;
  bodyType: BodyTypeKey;
}) {
  const palette = paletteBySeason[colorSeason] ?? paletteBySeason.bright_spring;
  const topShape = bodyType === 'upper_heavy'
    ? 'slim 或 wrap（修身上衣或收腰設計）'
    : bodyType === 'pear_shape'
      ? 'structured 或 cropped（提高視覺重心）'
      : 'regular 或 slim（維持上下比例）';
  const bottomShape = bodyType === 'upper_heavy'
    ? 'wide_leg 或 straight（闊腿 / 直筒褲平衡上半身）'
    : bodyType === 'pear_shape'
      ? 'straight 或 a_line（修飾臀腿比例）'
      : 'straight 或 wide_leg（穩定線條）';
  const occasionName = occasions.find(o => o.key === selectedOccasion)?.label ?? '日常休閒';
  const seasonName = seasons.find(s => s.key === selectedSeason)?.label ?? '春';

  return (
    <View style={styles.guideCard}>
      <View style={styles.guideHeader}>
        <Text style={styles.guideIcon}>🎨</Text>
        <View>
          <Text style={styles.guideTitle}>冷啟動色彩引導</Text>
          <Text style={styles.guideSub}>色季：{palette.name}</Text>
        </View>
      </View>

      <View style={styles.guideBody}>
        <Text style={styles.guideSection}>推薦購買顏色</Text>
        {palette.colors.map(item => (
          <View key={item.slot} style={styles.colorRow}>
            <View style={[styles.colorBlock, { backgroundColor: item.hex }]} />
            <View style={styles.colorInfo}>
              <Text style={styles.colorSlot}>{item.icon} {item.slot}</Text>
              <Text style={styles.colorLabel}>{item.label}</Text>
              <Text style={styles.colorHex}>{item.hex}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.guideSection}>💡 廓形建議</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoLine}>上衣：{topShape}</Text>
          <Text style={styles.infoLine}>下身：{bottomShape}</Text>
          <Text style={styles.infoMuted}>下身選分量感款式以平衡上下比例，避免寬鬆上衣壓低精神。</Text>
        </View>

        <Text style={styles.guideSection}>📝 分析說明</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoLine}>{palette.reason}</Text>
          <Text style={styles.infoMuted}>目前場景：{occasionName}；季節：{seasonName}。</Text>
        </View>
      </View>
    </View>
  );
}

function RecommendScreen({
  colorSeason,
  skinTone,
  bodyType,
}: {
  colorSeason: ColorSeasonKey;
  skinTone: SkinToneKey;
  bodyType: BodyTypeKey;
}) {
  const [selectedOccasion, setSelectedOccasion] = useState('work_interview');
  const [selectedSeason, setSelectedSeason] = useState<SeasonKey>('spring');
  const [showGuide, setShowGuide] = useState(false);

  return (
    <Page>
      <Text style={styles.bigTitle}>穿搭推薦</Text>

      {!showGuide ? (
        <>
          <Text style={styles.formLabel}>選擇場合</Text>
          <View style={styles.wrapRow}>
            {occasions.map(item => (
              <Chip
                key={item.key}
                label={item.label}
                sub={item.goal}
                selected={selectedOccasion === item.key}
                onPress={() => setSelectedOccasion(item.key)}
              />
            ))}
          </View>

          <Text style={styles.formLabel}>選擇季節</Text>
          <View style={styles.seasonGrid}>
            {seasons.map(item => (
              <TouchableOpacity
                key={item.key}
                style={[styles.seasonCard, selectedSeason === item.key && styles.seasonCardActive]}
                onPress={() => setSelectedSeason(item.key)}
              >
                <Text style={styles.seasonIcon}>{item.icon}</Text>
                <Text style={[styles.seasonText, selectedSeason === item.key && styles.seasonTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.blackButton} onPress={() => setShowGuide(true)}>
            <Text style={styles.blackButtonText}>✨ 獲取推薦</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity style={styles.blackButton} onPress={() => setShowGuide(false)}>
            <Text style={styles.blackButtonText}>✨ 獲取推薦</Text>
          </TouchableOpacity>
          <ColorGuide
            colorSeason={colorSeason}
            selectedOccasion={selectedOccasion}
            selectedSeason={selectedSeason}
            bodyType={bodyType}
          />
        </>
      )}

      <Text style={styles.hiddenMeta}>膚色底調：{skinTones.find(s => s.key === skinTone)?.label}</Text>
    </Page>
  );
}

function RecordsScreen() {
  return (
    <Page>
      <Text style={styles.bigTitle}>穿搭紀錄</Text>
      <View style={styles.recordEmpty}>
        <Text style={styles.recordIcon}>📋</Text>
        <Text style={styles.recordTitle}>尚未建立穿搭紀錄</Text>
        <Text style={styles.recordText}>之後可把 AI 推薦穿搭存成紀錄，回饋喜歡/不喜歡來調整推薦權重。</Text>
      </View>
    </Page>
  );
}

function SettingsScreen({
  colorSeason,
  setColorSeason,
  skinTone,
  setSkinTone,
  bodyType,
  setBodyType,
  onLogout,
}: {
  colorSeason: ColorSeasonKey;
  setColorSeason: (value: ColorSeasonKey) => void;
  skinTone: SkinToneKey;
  setSkinTone: (value: SkinToneKey) => void;
  bodyType: BodyTypeKey;
  setBodyType: (value: BodyTypeKey) => void;
  onLogout: () => void;
}) {
  async function logout() {
    await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'wardrobe_demo_mode']);
    onLogout();
  }

  return (
    <Page>
      <Text style={styles.bigTitle}>個人設定</Text>

      <View style={styles.settingsCard}>
        <SectionTitle title="色彩季型" sub="影響推薦配色規則" />
        <View style={styles.colorSeasonGrid}>
          {colorSeasons.map(item => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.colorSeasonCell,
                colorSeason === item.key && styles.colorSeasonCellActive,
                colorSeason === item.key && { backgroundColor: item.bg },
              ]}
              onPress={() => setColorSeason(item.key)}
            >
              <Text style={[styles.colorSeasonLabel, colorSeason === item.key && styles.purpleText]}>
                {item.label}
              </Text>
              {colorSeason === item.key ? <Text style={styles.colorSeasonDesc}>{item.desc}</Text> : null}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.settingsCard}>
        <SectionTitle title="膚色底調" sub="輔助配色建議" />
        <View style={styles.toneRow}>
          {skinTones.map(item => (
            <TouchableOpacity
              key={item.key}
              style={[styles.toneChip, skinTone === item.key && styles.toneChipActive]}
              onPress={() => setSkinTone(item.key)}
            >
              <Text style={[styles.toneText, skinTone === item.key && styles.purpleText]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.settingsCard}>
        <SectionTitle title="體型" sub="影響廓形推薦邏輯" />
        {bodyTypes.map(item => (
          <TouchableOpacity
            key={item.key}
            style={[styles.bodyOption, bodyType === item.key && styles.bodyOptionActive]}
            onPress={() => setBodyType(item.key)}
          >
            <Text style={[styles.bodyTitle, bodyType === item.key && styles.purpleText]}>{item.label}</Text>
            <Text style={[styles.bodyDesc, bodyType === item.key && styles.purpleText]}>{item.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveText}>✓ 已儲存</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>登出</Text>
      </TouchableOpacity>
    </Page>
  );
}

export function AppNavigator({ onLogout }: Props) {
  const [tab, setTab] = useState<TabKey>('recommend');
  const [colorSeason, setColorSeason] = useState<ColorSeasonKey>('bright_spring');
  const [skinTone, setSkinTone] = useState<SkinToneKey>('wheat_tan');
  const [bodyType, setBodyType] = useState<BodyTypeKey>('upper_heavy');

  const content = useMemo(() => {
    if (tab === 'wardrobe') return <WardrobeScreen />;
    if (tab === 'recommend') {
      return (
        <RecommendScreen
          colorSeason={colorSeason}
          skinTone={skinTone}
          bodyType={bodyType}
        />
      );
    }
    if (tab === 'records') return <RecordsScreen />;
    return (
      <SettingsScreen
        colorSeason={colorSeason}
        setColorSeason={setColorSeason}
        skinTone={skinTone}
        setSkinTone={setSkinTone}
        bodyType={bodyType}
        setBodyType={setBodyType}
        onLogout={onLogout}
      />
    );
  }, [bodyType, colorSeason, onLogout, skinTone, tab]);

  return (
    <View style={styles.shell}>
      <View style={styles.content}>{content}</View>
      <View style={styles.bottomNav}>
        {tabs.map(item => (
          <Pressable key={item.key} style={styles.navItem} onPress={() => setTab(item.key)}>
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={[styles.navLabel, tab === item.key && styles.navLabelActive]}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, backgroundColor: '#fff' },
  page: { paddingHorizontal: 18, paddingTop: 62, paddingBottom: 118, backgroundColor: '#fff' },
  fixedScreen: { flex: 1, paddingHorizontal: 18, paddingTop: 62, paddingBottom: 118, backgroundColor: '#fff' },
  screenHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bigTitle: { fontSize: 30, fontWeight: '900', color: '#111', marginBottom: 34 },
  countText: { fontSize: 20, color: '#888', fontWeight: '600', marginBottom: 34 },
  categoryRow: { flexDirection: 'row', gap: 10, height: 450 },
  categoryPill: {
    flex: 1,
    borderRadius: 28,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    paddingTop: 18,
  },
  categoryPillActive: { backgroundColor: '#2a2a2a' },
  categoryText: { fontSize: 18, fontWeight: '800', color: '#555' },
  categoryTextActive: { color: '#fff' },
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#aaa', fontSize: 18, textAlign: 'center' },
  fab: {
    position: 'absolute',
    right: 22,
    bottom: 100,
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#202020',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  fabText: { color: '#fff', fontSize: 42, lineHeight: 48 },
  formLabel: { fontSize: 20, fontWeight: '900', color: '#555', marginBottom: 14 },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 34 },
  chip: {
    borderWidth: 1.4,
    borderColor: '#dedede',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: '#202020', borderColor: '#202020' },
  chipLabel: { fontSize: 18, fontWeight: '800', color: '#555' },
  chipLabelActive: { color: '#fff' },
  chipSub: { color: '#aaa', fontSize: 14, marginTop: 4 },
  seasonGrid: { flexDirection: 'row', gap: 12, marginBottom: 34 },
  seasonCard: {
    flex: 1,
    height: 98,
    borderRadius: 14,
    borderWidth: 1.4,
    borderColor: '#dedede',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  seasonCardActive: { backgroundColor: '#202020', borderColor: '#202020' },
  seasonIcon: { fontSize: 24, marginBottom: 6 },
  seasonText: { fontSize: 20, fontWeight: '900', color: '#555' },
  seasonTextActive: { color: '#fff' },
  blackButton: {
    backgroundColor: '#202020',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  blackButtonText: { color: '#fff', fontSize: 24, fontWeight: '900' },
  hiddenMeta: { color: '#fff', fontSize: 1 },
  guideCard: {
    borderWidth: 1,
    borderColor: '#eee5ff',
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#f4edff',
    padding: 22,
  },
  guideIcon: { fontSize: 30 },
  guideTitle: { fontSize: 22, fontWeight: '900', color: '#2c176f' },
  guideSub: { color: '#8a64d6', fontSize: 18, fontWeight: '700', marginTop: 3 },
  guideBody: { padding: 18 },
  guideSection: { fontSize: 19, fontWeight: '900', color: '#666', marginTop: 10, marginBottom: 12 },
  colorRow: {
    flexDirection: 'row',
    minHeight: 76,
    borderWidth: 1.2,
    borderColor: '#e8e8e8',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#fbfbfb',
  },
  colorBlock: { width: 82 },
  colorInfo: { flex: 1, paddingHorizontal: 16, justifyContent: 'center' },
  colorSlot: { fontSize: 18, fontWeight: '900', color: '#222' },
  colorLabel: { fontSize: 16, color: '#555', marginTop: 2 },
  colorHex: { fontSize: 16, color: '#999', marginTop: 1 },
  infoBox: { backgroundColor: '#f7f7ff', borderRadius: 14, padding: 16, marginBottom: 14 },
  infoLine: { fontSize: 17, color: '#444', lineHeight: 28, fontWeight: '600' },
  infoMuted: { color: '#999', fontSize: 16, lineHeight: 24, marginTop: 8 },
  recordEmpty: { backgroundColor: '#fafafa', borderRadius: 18, padding: 26, alignItems: 'center' },
  recordIcon: { fontSize: 38 },
  recordTitle: { fontSize: 22, fontWeight: '900', color: '#222', marginTop: 10 },
  recordText: { fontSize: 16, color: '#777', textAlign: 'center', lineHeight: 24, marginTop: 8 },
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#7c3cff',
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  sectionTitleWrap: { marginBottom: 14 },
  sectionTitle: { fontSize: 24, fontWeight: '900', color: '#111' },
  sectionSub: { color: '#aaa', fontSize: 16, fontWeight: '600', marginTop: 3 },
  colorSeasonGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  colorSeasonCell: {
    width: '30.9%',
    minHeight: 72,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  colorSeasonCellActive: { borderColor: '#7c3cff', borderWidth: 2 },
  colorSeasonLabel: { color: '#555', fontWeight: '900', fontSize: 18 },
  colorSeasonDesc: { color: '#666', fontWeight: '700', fontSize: 13, textAlign: 'center', marginTop: 6 },
  purpleText: { color: '#7c3cff' },
  toneRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  toneChip: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  toneChipActive: { borderColor: '#7c3cff', borderWidth: 2, backgroundColor: '#f3ecff' },
  toneText: { fontSize: 18, fontWeight: '800', color: '#555' },
  bodyOption: {
    borderWidth: 1.5,
    borderColor: '#e5e5e5',
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
  },
  bodyOptionActive: { borderColor: '#7c3cff', borderWidth: 2, backgroundColor: '#f4edff' },
  bodyTitle: { fontSize: 20, fontWeight: '900', color: '#555' },
  bodyDesc: { fontSize: 16, color: '#aaa', marginTop: 4, fontWeight: '700' },
  saveButton: { backgroundColor: '#7c3cff', borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginBottom: 12 },
  saveText: { color: '#fff', fontSize: 24, fontWeight: '900' },
  logoutButton: { alignItems: 'center', paddingVertical: 14 },
  logoutText: { color: '#888', fontWeight: '800', fontSize: 16 },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 86,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    flexDirection: 'row',
    paddingTop: 8,
  },
  navItem: { flex: 1, alignItems: 'center' },
  navIcon: { fontSize: 25, marginBottom: 2 },
  navLabel: { fontSize: 16, color: '#aaa', fontWeight: '800' },
  navLabelActive: { color: '#111' },
});
