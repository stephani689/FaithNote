import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

/* =====================================================
   DATABASE AYAT DEARVERSE (LOKAL UNTUK MOOD)
===================================================== */

const verseDatabase = {
  Bahagia: [
    {
      reference: "Filipi 4:4",
      meaning:
        "Bersukacitalah senantiasa dalam Tuhan! Sekali lagi kukatakan: Bersukacitalah!",
      why:
        "Ayat ini mengingatkanmu untuk menikmati kebahagiaan yang sedang kamu rasakan dan mengarahkannya kepada Tuhan sebagai ungkapan syukur.",
      reminder:
        "Nikmati kebahagiaan hari ini. Jangan lupa bersyukur bahkan untuk hal-hal kecil yang membuat hatimu tersenyum. 🤍",
      prayer:
        "Tuhan, terima kasih untuk sukacita yang Engkau berikan hari ini. Ajarku untuk selalu bersyukur dan membagikan sukacita kepada orang lain. Amin.",
    },
    {
      reference: "Mazmur 118:24",
      meaning:
        "Inilah hari yang dijadikan TUHAN, marilah kita bersorak-sorak dan bersukacita karenanya!",
      why:
        "Saat hatimu sedang bahagia, ayat ini mengajakmu untuk menghargai hari yang sedang kamu jalani sebagai pemberian indah.",
      reminder:
        "Hari ini tidak akan terulang dengan cara yang sama. Nikmati dan syukuri setiap momennya. 🌷",
      prayer:
        "Tuhan, terima kasih untuk hari yang Engkau berikan. Bantu aku untuk menghargai setiap kesempatan dan berkat yang ada. Amin.",
    },
  ],

  Tenang: [
    {
      reference: "Yohanes 14:27",
      meaning:
        "Damai sejahtera Kutinggalkan bagimu. Damai sejahtera-Ku Kuberikan kepadamu, dan apa yang Kuberikan tidak seperti yang diberikan oleh dunia kepadamu. Janganlah gelisah dan gentar hatimu.",
      why:
        "Ayat ini mengingatkanmu bahwa ketenangan sejati tidak bergantung pada keadaan di sekitarmu, melainkan hadir dari kasih Tuhan.",
      reminder:
        "Tidak semua hal harus kamu selesaikan sekarang. Berhenti sejenak dan nikmati damai yang Tuhan berikan. 🌿",
      prayer:
        "Tuhan, terima kasih untuk damai yang Engkau berikan. Biarlah hatiku tetap tenang dan percaya penuh kepada-Mu. Amin.",
    },
  ],

  Sedih: [
    {
      reference: "Mazmur 34:19",
      meaning:
        "TUHAN itu dekat kepada orang-orang yang patah hati, dan Ia menyelamatkan orang-orang yang remuk jiwanya.",
      why:
        "Saat hati sedang berat dan terluka, ayat ini mengingatkan bahwa Tuhan tidak pernah jauh dari orang yang sedang bersedih.",
      reminder:
        "Tidak apa-apa untuk menangis. Kamu tidak harus terlihat kuat setiap saat. Tuhan memelukmu erat. 🤍",
      prayer:
        "Tuhan, Engkau mengetahui luka yang ada di dalam hatiku. Dekap aku dan berikan kekuatan untuk melewati hari ini. Amin.",
    },
  ],

  Cemas: [
    {
      reference: "Filipi 4:6-7",
      meaning:
        "Janganlah hendaknya kamu kuatir tentang apapun juga, tetapi nyatakanlah dalam segala hal keinginanmu kepada Allah dalam doa dan permohonan dengan ucapan syukur. Damai sejahtera Allah, yang melampaui segala akal, akan memelihara hati dan pikiranmu dalam Kristus Yesus.",
      why:
        "Ayat ini sangat dekat dengan keadaan ketika pikiran dipenuhi kekhawatiran dan beban berat.",
      reminder:
        "Tarik napas perlahan. Kamu tidak harus menyelesaikan semuanya hari ini. Satu langkah kecil saja sudah cukup. 🌷",
      prayer:
        "Tuhan, aku menyerahkan semua kekhawatiran dan ketakutanku kepada-Mu. Berikan damai dalam pikiran dan hatiku. Amin.",
    },
  ],

  Marah: [
    {
      reference: "Amsal 15:1",
      meaning:
        "Jawaban yang lemah lembut meredakan kegeraman, tetapi perkataan yang pedas membangkitkan marah.",
      why:
        "Ayat ini mengajakmu berhenti sejenak sebelum merespons ketika emosi sedang tinggi agar tidak menyesal kemudian.",
      reminder:
        "Tidak apa-apa merasa marah. Beri dirimu waktu untuk tenang dan bernapas sebelum merespons. 🌿",
      prayer:
        "Tuhan, bantu aku mengendalikan emosiku dan berikan kebijaksanaan dalam setiap perkataan yang aku ucapkan. Amin.",
    },
  ],

  Kesepian: [
    {
      reference: "Ulangan 31:8",
      meaning:
        "Sebab TUHAN, Dia sendiri akan berjalan di depanmu, Dia sendiri akan menyertai engkau, Dia tidak akan membiarkan engkau dan tidak akan meninggalkan engkau; janganlah takut dan janganlah patah hati.",
      why:
        "Saat merasa sendirian dan tak ada yang mengerti, ayat ini mengingatkan bahwa penyertaan Tuhan itu nyata.",
      reminder:
        "Walaupun hari ini terasa sepi, kamu tidak benar-benar sendirian. Tuhan tetap berjalan mendampingimu. 🤍",
      prayer:
        "Tuhan, ketika aku merasa sendiri, ingatkan aku bahwa Engkau selalu hadir dan memelukku. Amin.",
    },
  ],
};

/* =====================================================
   DATA MOOD
===================================================== */

const moods = [
  { name: "Bahagia", emoji: "✨🌻" },
  { name: "Tenang", emoji: "🌿🕊️" },
  { name: "Sedih", emoji: "🌧️🩹" },
  { name: "Cemas", emoji: "🌊🕯️" },
  { name: "Marah", emoji: "⚡🍂" },
  { name: "Kesepian", emoji: "🌙💭" },
];

/* =====================================================
   BOTTOM NAVIGATION COMPONENT
===================================================== */

const BottomNavigation = ({ active, onHome, onJourney, onVerse, onProfile }) => {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity onPress={onHome} style={styles.navItem}>
        <Text style={[styles.navText, active === "home" && styles.navActive]}>
          🏠 Beranda
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onJourney} style={styles.navItem}>
        <Text style={[styles.navText, active === "journey" && styles.navActive]}>
          📖 Perjalanan
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onVerse} style={styles.navItem}>
        <Text style={[styles.navText, active === "verses" && styles.navActive]}>
          📜 Cari Alkitab
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onProfile} style={styles.navItem}>
        <Text style={[styles.navText, active === "profile" && styles.navActive]}>
          🤍 Profil
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/* =====================================================
   APP UTAMA
===================================================== */

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [selectedMood, setSelectedMood] = useState("");
  const [story, setStory] = useState("");
  const [currentVerse, setCurrentVerse] = useState(null);
  const [journeys, setJourneys] = useState([]);

  // State untuk modal baca detail di Perjalanan
  const [selectedJourneyDetail, setSelectedJourneyDetail] = useState(null);

  // State khusus integrasi API SABDA Alkitab
  const [searchQuery, setSearchQuery] = useState("");
  const [apiResults, setApiResults] = useState([]);
  const [loadingApi, setLoadingApi] = useState(false);

  useEffect(() => {
    loadJourneys();
  }, []);

  const loadJourneys = async () => {
    try {
      const savedData = await AsyncStorage.getItem("dearverse_journeys");
      if (savedData) {
        setJourneys(JSON.parse(savedData));
      }
    } catch (error) {
      console.log("Gagal memuat perjalanan:", error);
    }
  };

  const saveJourney = async () => {
    if (!currentVerse) return;

    const newJourney = {
      id: Date.now().toString(),
      mood: selectedMood || "Refleksi",
      story: story.trim(),
      reference: currentVerse.reference,
      meaning: currentVerse.meaning,
      why: currentVerse.why,
      reminder: currentVerse.reminder,
      prayer: currentVerse.prayer,
      date: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };

    const updatedJourneys = [newJourney, ...journeys];

    try {
      await AsyncStorage.setItem(
        "dearverse_journeys",
        JSON.stringify(updatedJourneys)
      );
      setJourneys(updatedJourneys);
      Alert.alert("Tersimpan 🤍", "Ayat ini telah disimpan di Perjalananku.");
    } catch (error) {
      Alert.alert("Gagal", "Tidak dapat menyimpan perjalanan.");
    }
  };

  const deleteJourney = async (id) => {
    const updated = journeys.filter((j) => j.id !== id);
    try {
      await AsyncStorage.setItem("dearverse_journeys", JSON.stringify(updated));
      setJourneys(updated);
      setSelectedJourneyDetail(null);
      Alert.alert("Dihapus", "Catatan perjalanan telah dihapus.");
    } catch (error) {
      Alert.alert("Gagal", "Tidak dapat menghapus perjalanan.");
    }
  };

  const findVerse = () => {
    if (!selectedMood) {
      Alert.alert("Pilih Perasaan", "Pilih dulu apa yang sedang kamu rasakan 🤍");
      return;
    }

    const moodVerses = verseDatabase[selectedMood];
    const randomVerse = moodVerses[Math.floor(Math.random() * moodVerses.length)];

    setCurrentVerse(randomVerse);
    setScreen("result");
  };

  // FUNGSI MEMANGGIL API SABDA ALKITAB
  const fetchSabdaBible = async (query) => {
    if (!query.trim()) {
      Alert.alert("Peringatan", "Masukkan kata kunci pencarian Alkitab!");
      return;
    }

    setLoadingApi(true);
    setApiResults([]);

    try {
      const response = await fetch(
        `https://api-alkitab.sabda.org/search?q=${encodeURIComponent(query)}&type=json`
      );
      const data = await response.json();

      if (data && data.verses) {
        setApiResults(data.verses);
      } else {
        setApiResults([]);
      }
    } catch (error) {
      Alert.alert(
        "Koneksi Gagal",
        "Gagal mengambil data Alkitab dari SABDA. Pastikan koneksi internet terhubung."
      );
    } finally {
      setLoadingApi(false);
    }
  };

  /* ===================================================
     SCREEN: WELCOME (IKON GAMBAR SALIB KEMBALI HADIR)
  =================================================== */
  if (screen === "welcome") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.content}>
          {/* Menggunakan Image Asset untuk Ikon Salib Gambar */}
         <Image 
  source={require('./assets/faithnotelogo.jpg')} 
  style={{ width: 120, height: 120 }} 
/>
          <Text style={styles.appName}>DearVerse</Text>
          <Text style={styles.tagline}>Your story. His words.</Text>
          <Text style={styles.description}>
            Ruang tenang untuk merefleksikan harimu dan menemukan ayat-ayat Alkitab yang menguatkan jiwamu.
          </Text>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => setScreen("home")}
          >
            <Text style={styles.buttonText}>Begin Your Journey</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  /* ===================================================
     SCREEN: HOME
  =================================================== */
  if (screen === "home") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={styles.homeContainer}>
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Selamat datang kembali 🤍</Text>
            <Text style={styles.questionText}>Bagaimana hatimu hari ini?</Text>
          </View>

          <Text style={styles.sectionTitle}>Apa yang sedang kamu rasakan?</Text>
          <View style={styles.moodContainer}>
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood.name}
                style={[
                  styles.moodButton,
                  selectedMood === mood.name && styles.moodButtonSelected,
                ]}
                onPress={() => setSelectedMood(mood.name)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={styles.moodText}>{mood.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Ceritakan harimu (opsional)</Text>
          <TextInput
            style={styles.storyInput}
            placeholder="Apa yang sedang ada di dalam hatimu?"
            placeholderTextColor="#B09A85"
            multiline
            value={story}
            onChangeText={setStory}
          />

          <TouchableOpacity style={styles.mainButton} onPress={findVerse}>
            <Text style={styles.mainButtonText}>Temukan Ayat untuk Hatiku</Text>
          </TouchableOpacity>
        </ScrollView>

        <BottomNavigation
          active="home"
          onHome={() => setScreen("home")}
          onJourney={() => setScreen("journey")}
          onVerse={() => setScreen("verses")}
          onProfile={() => setScreen("profile")}
        />
      </SafeAreaView>
    );
  }

  /* ===================================================
     SCREEN: RESULT (5 ELEMEN LENGKAP)
  =================================================== */
  if (screen === "result" && currentVerse) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={styles.resultContainer}>
          <TouchableOpacity onPress={() => setScreen("home")} style={styles.backButton}>
            <Text style={styles.backText}>← Kembali</Text>
          </TouchableOpacity>

          <Text style={styles.resultTitle}>Ayat untuk Hatimu 🤍</Text>

          {/* 1. Ayat & Referensi */}
          <View style={styles.verseCard}>
            <Text style={styles.verseReference}>{currentVerse.reference}</Text>
            <Text style={styles.verseMeaning}>"{currentVerse.meaning}"</Text>
          </View>

          {/* 2. Mengapa Ayat Ini */}
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Mengapa Ayat Ini? 💡</Text>
            <Text style={styles.infoText}>{currentVerse.why}</Text>
          </View>

          {/* 3. Catatan Cerita Kamu (jika diisi) */}
          {story.trim().length > 0 && (
            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>Ceritamu 📝</Text>
              <Text style={styles.infoText}>"{story}"</Text>
            </View>
          )}

          {/* 4. Sedikit Pengingat */}
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Sedikit Pengingat 🌷</Text>
            <Text style={styles.infoText}>{currentVerse.reminder}</Text>
          </View>

          {/* 5. Doa */}
          <View style={styles.prayerCard}>
            <Text style={styles.cardTitle}>Doa 🤍</Text>
            <Text style={styles.infoText}>{currentVerse.prayer}</Text>
          </View>

          <TouchableOpacity style={styles.mainButton} onPress={saveJourney}>
            <Text style={styles.mainButtonText}>Simpan ke Perjalananku</Text>
          </TouchableOpacity>
        </ScrollView>

        <BottomNavigation
          active="home"
          onHome={() => setScreen("home")}
          onJourney={() => setScreen("journey")}
          onVerse={() => setScreen("verses")}
          onProfile={() => setScreen("profile")}
        />
      </SafeAreaView>
    );
  }

  /* ===================================================
     SCREEN: SEMUA AYAT / API SABDA ALKITAB
  =================================================== */
  if (screen === "verses") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={styles.resultTitle}>Pencarian Alkitab SABDA 📜</Text>
          <Text style={{ color: "#8B6B58", marginBottom: 12, fontSize: 12 }}>
            Cari ayat dari Kejadian sampai Wahyu secara online.
          </Text>

          <View style={{ flexDirection: "row", marginBottom: 16 }}>
            <TextInput
              style={[styles.storyInput, { flex: 1, height: 48, marginBottom: 0 }]}
              placeholder="Cari kata kunci (cth: Kasih, Damai, Yohanes)..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity
              style={[
                styles.mainButton,
                { paddingHorizontal: 16, marginLeft: 8, marginBottom: 0, justifyContent: "center" },
              ]}
              onPress={() => fetchSabdaBible(searchQuery)}
            >
              <Text style={styles.mainButtonText}>Cari</Text>
            </TouchableOpacity>
          </View>

          {loadingApi ? (
            <ActivityIndicator size="large" color="#8B6B58" style={{ marginTop: 20 }} />
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {apiResults.length === 0 ? (
                <Text style={{ textAlign: "center", color: "#A08C7D", marginTop: 40 }}>
                  Ketik kata kunci di atas untuk menjelajahi Alkitab.
                </Text>
              ) : (
                apiResults.map((item, index) => (
                  <View key={index} style={styles.infoCard}>
                    <Text style={styles.cardTitle}>
                      {item.book_name} {item.chapter}:{item.verse}
                    </Text>
                    <Text style={styles.infoText}>{item.content}</Text>
                  </View>
                ))
              )}
            </ScrollView>
          )}
        </View>

        <BottomNavigation
          active="verses"
          onHome={() => setScreen("home")}
          onJourney={() => setScreen("journey")}
          onVerse={() => setScreen("verses")}
          onProfile={() => setScreen("profile")}
        />
      </SafeAreaView>
    );
  }

  /* ===================================================
     SCREEN: PERJALANANKU (KLIK & BACA ULANG DETAIL)
  =================================================== */
  if (screen === "journey") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={styles.resultTitle}>Perjalananku 📖</Text>
          <Text style={{ color: "#8B6B58", marginBottom: 16, fontSize: 12 }}>
            Ketuk ayat di bawah ini untuk membaca ulang seluruh perenunganmu.
          </Text>

          <ScrollView style={{ marginTop: 4 }}>
            {journeys.length === 0 ? (
              <Text style={{ textAlign: "center", color: "#A08C7D", marginTop: 40 }}>
                Belum ada perjalanan tersimpan. Temukan ayat dan simpan untuk dibaca ulang!
              </Text>
            ) : (
              journeys.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.journeyCardClickable}
                  onPress={() => setSelectedJourneyDetail(item)}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={styles.cardTitle}>{item.reference}</Text>
                    <Text style={styles.moodTag}>Mood: {item.mood}</Text>
                  </View>
                  <Text style={styles.infoText} numberOfLines={2}>
                    "{item.meaning}"
                  </Text>
                  <Text style={{ fontSize: 11, color: "#A08C7D", marginTop: 8 }}>
                    📅 {item.date} • Ketuk untuk baca ulang →
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>

        {/* MODAL POP-UP UNTUK BACA ULANG CATATAN UTUH */}
        <Modal
          visible={selectedJourneyDetail !== null}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSelectedJourneyDetail(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {selectedJourneyDetail && (
                  <>
                    <Text style={styles.resultTitle}>{selectedJourneyDetail.reference}</Text>
                    <Text style={{ color: "#8B6B58", fontSize: 12, marginBottom: 12 }}>
                      {selectedJourneyDetail.date} • Perasaan: {selectedJourneyDetail.mood}
                    </Text>

                    <View style={styles.verseCard}>
                      <Text style={styles.verseMeaning}>
                        "{selectedJourneyDetail.meaning}"
                      </Text>
                    </View>

                    {selectedJourneyDetail.why && (
                      <View style={styles.infoCard}>
                        <Text style={styles.cardTitle}>Mengapa Ayat Ini? 💡</Text>
                        <Text style={styles.infoText}>{selectedJourneyDetail.why}</Text>
                      </View>
                    )}

                    {selectedJourneyDetail.story ? (
                      <View style={styles.infoCard}>
                        <Text style={styles.cardTitle}>Catatan Harimu 📝</Text>
                        <Text style={styles.infoText}>"{selectedJourneyDetail.story}"</Text>
                      </View>
                    ) : null}

                    {selectedJourneyDetail.reminder && (
                      <View style={styles.infoCard}>
                        <Text style={styles.cardTitle}>Pengingat 🌷</Text>
                        <Text style={styles.infoText}>{selectedJourneyDetail.reminder}</Text>
                      </View>
                    )}

                    {selectedJourneyDetail.prayer && (
                      <View style={styles.prayerCard}>
                        <Text style={styles.cardTitle}>Doa 🤍</Text>
                        <Text style={styles.infoText}>{selectedJourneyDetail.prayer}</Text>
                      </View>
                    )}

                    <TouchableOpacity
                      style={[styles.mainButton, { backgroundColor: "#D9534F", marginBottom: 10 }]}
                      onPress={() => deleteJourney(selectedJourneyDetail.id)}
                    >
                      <Text style={styles.mainButtonText}>Hapus Perjalanan Ini</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.mainButton}
                      onPress={() => setSelectedJourneyDetail(null)}
                    >
                      <Text style={styles.mainButtonText}>Tutup</Text>
                    </TouchableOpacity>
                  </>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>

        <BottomNavigation
          active="journey"
          onHome={() => setScreen("home")}
          onJourney={() => setScreen("journey")}
          onVerse={() => setScreen("verses")}
          onProfile={() => setScreen("profile")}
        />
      </SafeAreaView>
    );
  }

  /* ===================================================
     SCREEN: PROFIL
  =================================================== */
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={styles.resultTitle}>Profil Saya 🤍</Text>
        <View style={[styles.infoCard, { marginTop: 20 }]}>
          <Text style={styles.cardTitle}>DearVerse App</Text>
          <Text style={styles.infoText}>Versi 1.1.0</Text>
          <Text style={[styles.infoText, { marginTop: 8 }]}>
            Aplikasi jurnal perenungan pribadi terintegrasi API Alkitab SABDA.
          </Text>
        </View>
      </View>

      <BottomNavigation
        active="profile"
        onHome={() => setScreen("home")}
        onJourney={() => setScreen("journey")}
        onVerse={() => setScreen("verses")}
        onProfile={() => setScreen("profile")}
      />
    </SafeAreaView>
  );
}

/* =====================================================
   STYLESHEET
===================================================== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDFBF7" },
  content: { flex: 1, paddingHorizontal: 28, justifyContent: "center", alignItems: "center" },
  crossImage: { width: 50, height: 50, marginBottom: 16, tintColor: "#5C4033" },
  appName: { fontSize: 32, fontWeight: "700", color: "#5C4033", marginBottom: 6 },
  tagline: { fontSize: 16, color: "#8B6B58", fontStyle: "italic", marginBottom: 16 },
  description: { fontSize: 14, color: "#7A685A", textAlign: "center", lineHeight: 22, marginBottom: 32 },
  button: { backgroundColor: "#8B6B58", paddingVertical: 14, paddingHorizontal: 32, borderRadius: 25 },
  buttonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
  homeContainer: { padding: 24, paddingBottom: 100 },
  header: { marginBottom: 24 },
  welcomeText: { fontSize: 14, color: "#8B6B58" },
  questionText: { fontSize: 22, fontWeight: "700", color: "#5C4033", marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#5C4033", marginTop: 16, marginBottom: 12 },
  moodContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  moodButton: { width: "30%", backgroundColor: "#FFF", paddingVertical: 12, borderRadius: 16, alignItems: "center", marginBottom: 12, borderWidth: 1, borderColor: "#EFE8E1" },
  moodButtonSelected: { borderColor: "#8B6B58", backgroundColor: "#F5EFEA" },
  moodEmoji: { fontSize: 20, marginBottom: 4 },
  moodText: { fontSize: 12, fontWeight: "500", color: "#5C4033" },
  storyInput: { backgroundColor: "#FFF", borderRadius: 16, padding: 16, height: 100, borderWidth: 1, borderColor: "#EFE8E1", fontSize: 14, color: "#5C4033", marginBottom: 20 },
  mainButton: { backgroundColor: "#8B6B58", paddingVertical: 16, borderRadius: 25, alignItems: "center", marginBottom: 24 },
  mainButtonText: { color: "#FFF", fontSize: 15, fontWeight: "600" },
  resultContainer: { padding: 24, paddingBottom: 100 },
  backButton: { marginBottom: 16 },
  backText: { color: "#8B6B58", fontSize: 14, fontWeight: "600" },
  resultTitle: { fontSize: 22, fontWeight: "700", color: "#5C4033" },
  verseCard: { backgroundColor: "#8B6B58", padding: 20, borderRadius: 16, marginVertical: 16 },
  verseReference: { color: "#FFF", fontSize: 18, fontWeight: "700", marginBottom: 8 },
  verseMeaning: { color: "#FDFBF7", fontSize: 14, lineHeight: 22 },
  infoCard: { backgroundColor: "#FFF", padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: "#EFE8E1" },
  prayerCard: { backgroundColor: "#F5EFEA", padding: 16, borderRadius: 16, marginBottom: 24 },
  cardTitle: { fontSize: 14, fontWeight: "700", color: "#5C4033", marginBottom: 6 },
  infoText: { fontSize: 13, color: "#5C4033", lineHeight: 20 },
  journeyCardClickable: { backgroundColor: "#FFF", padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: "#EFE8E1", elevation: 1 },
  moodTag: { fontSize: 11, color: "#8B6B58", fontWeight: "600" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: "center", padding: 20 },
  modalContent: { backgroundColor: "#FDFBF7", borderRadius: 20, padding: 20, maxHeight: "85%" },
  navBar: { flexDirection: "row", position: "absolute", bottom: 0, left: 0, right: 0, height: 60, backgroundColor: "#FFF", borderTopWidth: 1, borderTopColor: "#EFE8E1", alignItems: "center", justifyContent: "space-around" },
  navItem: { padding: 10 },
  navText: { fontSize: 12, color: "#A08C7D" },
  navActive: { color: "#8B6B58", fontWeight: "700" },
});