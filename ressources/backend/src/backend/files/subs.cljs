(ns backend.files.subs
  (:require [re-frame.core :as rf]))

(rf/reg-sub
  :jups.backend.subs/files-url
  (fn [db [_ list-kw]]
    (-> db :files-dropdowns list-kw)))

(rf/reg-sub
  :jups.backend.subs/files-year
  (fn [db [_ list-kw]]
    (let [url (-> db :files-dropdowns list-kw)
          raw (first (clojure.string/split url "/"))]
      (if (= raw "")
        nil
        (keyword raw)))))

(rf/reg-sub
  :jups.backend.subs/files-file
  (fn [db [_ list-kw]]
    (let [url (-> db :files-dropdowns list-kw)
          raw (second (clojure.string/split url "/"))]
      (if (= raw "")
        nil
        raw))))