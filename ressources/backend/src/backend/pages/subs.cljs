(ns backend.pages.subs
  (:require
    [re-frame.core :as rf]))

(rf/reg-sub
  :jups.backend.subs/pages
  (fn [db _]
    (:pages db)))

(rf/reg-sub
  :jups.backend.subs/active-page-name
  (fn [db _]
    (:active-page db)))

(rf/reg-sub
  :jups.backend.subs/changed-page
  (fn [db [_ page-kw]]
    (-> db :changed-pages page-kw)))

(rf/reg-sub
  :jups.backend.subs/changed-pages
  (fn [db _]
    (:changed-pages db)))

(rf/reg-sub
  :jups.backend.subs/active-page-field
  (fn [db [_ kw]]
    (get-in db [:changed-pages (:active-page db) kw])))

(rf/reg-sub
  :jups.backend.subs/pages-file-url
  (fn [db [_ list-kw]]
    (-> db :pages-dropdowns list-kw)))

(rf/reg-sub
  :jups.backend.subs/page-year
  (fn [db [_ list-kw]]
    (let [url (-> db :pages-dropdowns list-kw)
          raw (first (clojure.string/split url "/"))]
      (if (= raw "")
        nil
        (keyword raw)))))

(rf/reg-sub
  :jups.backend.subs/page-file
  (fn [db [_ list-kw]]
    (let [url (-> db :pages-dropdowns list-kw)
          raw (second (clojure.string/split url "/"))]
      (if (= raw "")
        nil
        raw))))