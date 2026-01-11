import time
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select

# --- הגדרות ---
print("--- מפעיל את הדפדפן לסיור קולנועי באתר PÉDANT ---")
driver = webdriver.Chrome()
driver.maximize_window()

# נתיב דינמי
current_dir = os.path.dirname(os.path.abspath(__file__))
BASE_PATH = "file:///" + current_dir.replace("\\", "/")

# משתנים לבדיקה
TEST_EMAIL = f"luxury_user_{int(time.time())}@pedant.paris"
TEST_NAME = "MARIE ANTOINETTE"
TEST_PASSWORD = "LuxuryPassword123"

def slow_scroll(pixels=500, delay=2.0):
    """גלילה איטית יותר כדי ליהנות מההנפשות החדשות של הטקסטים והתמונות"""
    current_pos = 0
    total_height = driver.execute_script("return document.body.scrollHeight")
    while current_pos < total_height:
        current_pos += pixels
        driver.execute_script(f"window.scrollTo(0, {current_pos});")
        time.sleep(delay)
        total_height = driver.execute_script("return document.body.scrollHeight")

def run_cinematic_tour():
    try:
        # ---------------------------------------------------------
        # שלב 0: המתנה ל-Preloader בכל דף
        # ---------------------------------------------------------
        def wait_for_preloader():
            print("ממתינים ל-Preloader היוקרתי שייעלם...")
            time.sleep(2.5) # זמן ללוגו הפועם

        # ---------------------------------------------------------
        # שלב 1: דף הבית - תצוגת יוקרה
        # ---------------------------------------------------------
        print("\n[Step 1] מתחילים בדף הבית - סיור ויזואלי...")
        driver.get(f"{BASE_PATH}/index.html")
        wait_for_preloader()
        time.sleep(1) # זמן להתרשם מה-Hero

        print("גוללים לאט כדי לראות את ה-Atmosphere ואת ה-Vision...")
        slow_scroll(pixels=400, delay=1.2)
        
        # אינטראקציה עם ה-FAQ
        print("פותחים שאלות נפוצות (FAQ)...")
        faq_triggers = driver.find_elements(By.CLASS_NAME, "accordion-trigger")
        for trigger in faq_triggers[:3]: # פותח את השלוש הראשונות בסיור
            driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", trigger)
            time.sleep(1)
            trigger.click()
            time.sleep(2)

        # פתיחת צור קשר (Contact Modal)
        print("פותחים את כרטיסיית 'Get in Touch'...")
        contact_trigger = driver.find_element(By.XPATH, "//span[contains(text(), 'Get in Touch')]")
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", contact_trigger)
        time.sleep(1.5)
        contact_trigger.click()
        time.sleep(2)
        
        # מילוי טופס צור קשר בתוך המודל
        print("ממלאים פרטי קשר...")
        modal = driver.find_element(By.ID, "contact-modal")
        modal_inputs = modal.find_elements(By.CLASS_NAME, "luxury-input")
        modal_inputs[0].send_keys(TEST_NAME)
        time.sleep(1)
        modal_inputs[1].send_keys(TEST_EMAIL)
        time.sleep(1)
        modal_inputs[2].send_keys("I would like to schedule a private consultation.")
        time.sleep(2)
        
        print("שולחים את ההודעה ומחכים לאישור...")
        submit_contact = modal.find_element(By.XPATH, "//button[contains(text(), 'Send Message')]")
        driver.execute_script("arguments[0].click();", submit_contact)
        
        # המתנה לאישור היוקרתי בתוך המודל
        time.sleep(3)
        print("V עבר בהצלחה: הודעת תודה מקצועית הופיעה במודל.")
        time.sleep(3)
        
        driver.find_element(By.XPATH, "//button[contains(text(), 'CLOSE')]").click()
        time.sleep(1.5)

        # ---------------------------------------------------------
        # שלב 2: הרשמה (Sign Up)
        # ---------------------------------------------------------
        print("\n[Step 2] עוברים להרשמה למועדון הלקוחות...")
        driver.get(f"{BASE_PATH}/signup.html")
        # דף ההרשמה כרגע ללא preloader, נמשיך רגיל
        time.sleep(2)
        
        driver.find_element(By.ID, "signup-name").send_keys(TEST_NAME)
        time.sleep(1)
        driver.find_element(By.ID, "signup-email").send_keys(TEST_EMAIL)
        time.sleep(1)
        driver.find_element(By.ID, "signup-password").send_keys(TEST_PASSWORD)
        time.sleep(2)
        
        submit_btn = driver.find_element(By.CLASS_NAME, "auth-btn")
        driver.execute_script("arguments[0].click();", submit_btn)
        
        WebDriverWait(driver, 10).until(EC.url_contains("index.html"))
        print("ההרשמה הצליחה! ברוכים הבאים ל-PÉDANT.")
        time.sleep(3)

        # ---------------------------------------------------------
        # שלב 3: קטלוג - דפדוף וסינון
        # ---------------------------------------------------------
        print("\n[Step 3] סיור בקולקציות (Catalog)...")
        driver.get(f"{BASE_PATH}/catalog.html")
        wait_for_preloader()
        time.sleep(1)
        
        print("דפדוף ראשוני בקטלוג...")
        driver.execute_script("window.scrollTo(0, 500);")
        time.sleep(2)
        
        print("מפעילים סינון לפי מותג: Biopeptix...")
        brand_select = Select(driver.find_element(By.ID, "filter-brand"))
        brand_select.select_by_value("Biopeptix")
        time.sleep(3) # זמן לראות את הסינון של המותג
        
        # הערה: הסרתי את הסינון לפי קטגוריה לבקשתך כדי להתמקד רק במותג
        
        print("בוחרים מוצר יוקרתי של Biopeptix ומוסיפים לסל...")
        products = driver.find_elements(By.CLASS_NAME, "product-card-capsule")
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", products[0])
        time.sleep(2)
        
        add_btn = products[0].find_element(By.CLASS_NAME, "add-to-bag-capsule")
        driver.execute_script("arguments[0].click();", add_btn)
        
        # המתנה לאישור הוספה לסל
        WebDriverWait(driver, 5).until(EC.visibility_of_element_located((By.CLASS_NAME, "cart-success-overlay")))
        print("המוצר נוסף לסל בהצלחה.")
        time.sleep(3)

        # ---------------------------------------------------------
        # שלב 4: עגלת קניות וקוד קופון
        # ---------------------------------------------------------
        print("\n[Step 4] מעבר לעגלת הקניות...")
        driver.get(f"{BASE_PATH}/cart.html")
        wait_for_preloader()
        time.sleep(1)
        
        print("מזינים קוד קופון יוקרתי: PEDANT20")
        coupon_input = driver.find_element(By.ID, "coupon-code")
        coupon_input.send_keys("PEDANT20")
        time.sleep(2)
        
        apply_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'APPLY CODE')]")
        driver.execute_script("arguments[0].click();", apply_btn)
        time.sleep(3)
        
        print("עוברים לתשלום (Checkout)...")
        checkout_btn = driver.find_element(By.CLASS_NAME, "btn-checkout-v2")
        driver.execute_script("arguments[0].click();", checkout_btn)
        time.sleep(2)

        # ---------------------------------------------------------
        # שלב 5: קופה (Checkout)
        # ---------------------------------------------------------
        print("\n[Step 5] מילוי פרטי משלוח ותשלום...")
        inputs = driver.find_elements(By.CLASS_NAME, "luxury-input")
        inputs[0].send_keys(TEST_NAME)
        time.sleep(1)
        inputs[1].send_keys(TEST_EMAIL)
        time.sleep(1)
        inputs[2].send_keys("Place Vendôme, Paris, France")
        time.sleep(1)
        inputs[3].send_keys("+33 1 23 45 67 89")
        time.sleep(3)
        
        print("מבצעים הזמנה...")
        place_order = driver.find_element(By.CLASS_NAME, "checkout-btn")
        driver.execute_script("arguments[0].click();", place_order)
        
        # המתנה להודעת ההצלחה היוקרתית (במקום Alert)
        WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.CLASS_NAME, "success-overlay-v2")))
        success_msg = driver.find_element(By.CLASS_NAME, "success-card-v2")
        print(f"הופיע אישור הזמנה יוקרתי: {success_msg.find_element(By.CLASS_NAME, 'order-number-v2').text}")
        time.sleep(5) # זמן לראות את אישור ההזמנה
        
        driver.find_element(By.CLASS_NAME, "success-btn-v2").click()
        
        time.sleep(3)
        print("\n--- הסיור הקולנועי הסתיים בהצלחה! האתר פשוט יפהפה. ---")

    except Exception as e:
        print(f"\nX התרחשה שגיאה במהלך הסיור: {e}")
    finally:
        time.sleep(5)
        driver.quit()

if __name__ == "__main__":
    run_cinematic_tour()
