(ns backend.pages.subs
  (:require
    [re-frame.core :as rf]))

(rf/reg-sub
  :jups.backend.subs/pages
  (fn [db _]
    (:pages db)))