# Haber Nexus'a Katkıda Bulunma Rehberi

Öncelikle, projeye katkıda bulunmayı düşündüğünüz için teşekkür ederiz! Haber Nexus, açık kaynaklı bir projedir ve topluluğun desteğiyle büyümeyi hedefler.

Bu rehber, projeye nasıl katkıda bulunabileceğiniz konusunda size yol gösterecektir.

## Davranış Kuralları

Katılımcıların ve geliştiricilerin uyumlu ve saygılı bir ortamda çalışabilmesi için [Code of Conduct](CODE_OF_CONDUCT.md) belgesini oluşturduk. Lütfen bu belgeyi okuyun ve projenin her aşamasında bu kurallara uyun.

## Nasıl Katkıda Bulunabilirim?

### Hata Bildirimi (Bug Report)

Bir hata bulduğunuzda, lütfen GitHub Issues üzerinden yeni bir "Bug Report" oluşturun. Raporunuzda aşağıdaki bilgileri eklemeye çalışın:

- **Hatanın Açıklaması**: Karşılaştığınız sorunu net bir şekilde açıklayın.
- **Tekrarlama Adımları**: Hatayı nasıl tekrarlayabileceğimizi adım adım anlatın.
- **Beklenen Davranış**: Normalde ne olmasını beklediğinizi belirtin.
- **Ekran Görüntüsü**: Mümkünse, hatayı gösteren bir ekran görüntüsü ekleyin.
- **Ortam Bilgileri**: Kullandığınız tarayıcı, işletim sistemi gibi bilgileri ekleyin.

### Özellik Talebi (Feature Request)

Yeni bir özellik veya iyileştirme fikriniz varsa, GitHub Issues üzerinden "Feature Request" oluşturabilirsiniz. Talebinizde şu noktalara değinin:

- **Sorun ve Çözüm**: Bu özelliğin hangi sorunu çözdüğünü ve nasıl bir çözüm sunduğunu açıklayın.
- **Alternatifler**: Düşündüğünüz alternatif çözümler var mı?
- **Ek Bilgi**: Özelliğin nasıl çalışması gerektiğine dair detaylar veya örnekler ekleyin.

### Kod Katkısı

Kod katkısı yapmak için aşağıdaki adımları izleyebilirsiniz:

1.  **Projeyi Fork'layın**: Kendi GitHub hesabınıza projenin bir kopyasını oluşturun.
2.  **Repository'yi Klonlayın**: Fork'ladığınız projeyi yerel makinenize indirin.
    ```bash
    git clone https://github.com/KULLANICI_ADINIZ/haber-nexus.git
    ```
3.  **Yeni Bir Branch Oluşturun**: Yapacağınız değişikliğe uygun bir isimle yeni bir branch oluşturun.
    ```bash
    git checkout -b feature/yeni-ozellik
    # veya
    git checkout -b fix/hata-duzeltmesi
    ```
4.  **Değişikliklerinizi Yapın**: Kodu düzenleyin, yeni özellikler ekleyin veya hataları düzeltin.
5.  **Commit'lerinizi Oluşturun**: Anlamlı commit mesajları ile değişikliklerinizi kaydedin. [Conventional Commits](https://www.conventionalcommits.org/) standardını takip etmeye özen gösterin.
    ```bash
    git commit -m "feat: Kullanıcı profili için avatar yükleme özelliği eklendi"
    ```
6.  **Branch'inizi Push'layın**: Değişikliklerinizi GitHub'daki fork'unuza gönderin.
    ```bash
    git push origin feature/yeni-ozellik
    ```
7.  **Pull Request (PR) Oluşturun**: Haber Nexus ana repository'sine bir Pull Request gönderin. PR açıklamasında yaptığınız değişiklikleri detaylı bir şekilde anlatın ve ilgili issue numarasını belirtin (e.g., `Closes #123`).

### Kod Standartları

- **TypeScript**: Proje TypeScript ile yazılmıştır. Tip güvenliğine önem verin ve `any` tipini kullanmaktan kaçının.
- **ESLint**: Kod stilini ve kalitesini korumak için ESLint kullanıyoruz. Lütfen commit'lemeden önce `pnpm lint` komutunu çalıştırarak hataları giderin.
- **Testler**: Önemli değişiklikler için test yazmanız beklenir (henüz test altyapısı kurulmadı).

## Geliştirme Ortamı Kurulumu

Detaylı kurulum adımları için [README.md](README.md) dosyasındaki "Kurulum ve Çalıştırma" bölümünü takip edebilirsiniz.

Katkılarınız için şimdiden teşekkürler!
