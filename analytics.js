// ============================================================
//  analytics.js — GA4 Tracking cho Light & Night Refund
// ============================================================

const Analytics = (() => {

  // ----------------------------------------------------------
  // Lấy ngôn ngữ hiện tại từ <html data-lang="...">
  // ----------------------------------------------------------
  function getCurrentLang() {
    return document.documentElement.getAttribute('data-lang') || 'en';
  }

  // ----------------------------------------------------------
  // 1. TRACK PAGE VIEW THEO NGÔN NGỮ
  // ----------------------------------------------------------
  function trackPageView() {
    const lang = getCurrentLang();
    gtag('event', 'page_view_by_language', {
      language  : lang,
      page_path : window.location.pathname,
      page_title: document.title,
    });
    console.log('[Analytics] page_view_by_language:', lang);
  }

  // ----------------------------------------------------------
  // 2. TRACK CHUYỂN NGÔN NGỮ
  // ----------------------------------------------------------
  function trackLanguageSwitch(fromLang, toLang) {
    gtag('event', 'language_switch', {
      from_language: fromLang,
      to_language  : toLang,
    });
    console.log(`[Analytics] language_switch: ${fromLang} → ${toLang}`);
  }

  // ----------------------------------------------------------
  // 3. TRACK CLICK / CHỌN GÓI NẠP
  // ----------------------------------------------------------
  function trackPackageSelect(packageName, isChecked) {
    gtag('event', 'select_package', {
      package_name: packageName,
      action      : isChecked ? 'select' : 'deselect',
      language    : getCurrentLang(),
    });
    console.log(`[Analytics] select_package: ${packageName} (${isChecked ? 'selected' : 'deselected'})`);
  }

  // ----------------------------------------------------------
  // INIT
  // ----------------------------------------------------------
  function init() {
    // 1. Track page view ngay khi load
    trackPageView();

    // 2. Track chuyển ngôn ngữ
    // ⚠️ Thay '.lang-btn' bằng selector đúng của nút EN/VI/TH
    document.querySelectorAll('[data-lang]').forEach(btn => {
      // Chỉ gắn cho những nút TRONG body, không phải <html>
      if (btn.tagName === 'HTML') return;

      btn.addEventListener('click', function () {
        const fromLang = getCurrentLang();
        const toLang   = this.getAttribute('data-lang');

        if (toLang && toLang !== fromLang) {
          trackLanguageSwitch(fromLang, toLang);
        }
      });
    });

    // 3. Track chọn gói nạp (checkbox)
    // ⚠️ Thay 'input[type="checkbox"]' nếu cần selector cụ thể hơn
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', function () {
        // Lấy tên gói từ label hoặc data attribute gần nhất
        const label       = this.closest('label') || document.querySelector(`label[for="${this.id}"]`);
        const packageName = this.dataset.package
                          || this.value
                          || (label && label.textContent.trim().split('\n')[0].trim())
                          || 'Unknown Package';

        trackPackageSelect(packageName, this.checked);
      });
    });
  }

  return { init, trackPageView, trackLanguageSwitch, trackPackageSelect };

})();

document.addEventListener('DOMContentLoaded', Analytics.init);
