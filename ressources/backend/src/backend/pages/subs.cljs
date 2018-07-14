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