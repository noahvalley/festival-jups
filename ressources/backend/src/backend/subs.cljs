(ns backend.subs
  (:require
    [re-frame.core :as rf]
    [backend.utils :as utils]))

(rf/reg-sub
  :jups.backend.subs/active-panel
  (fn [db _]
    (:active-panel db)))

(rf/reg-sub
  :jups.backend.subs/db
  (fn [db [_ path]]
    (get-in db path)))

(rf/reg-sub
  :jups.backend.subs/years-dropdown
  (fn [db [_ images-or-files]]
    (sort #(> (-> %1 :label .toLowerCase) (-> %2 :label .toLowerCase))
          (conj (mapv (fn [k] {:id k :label (name k)}) (keys (images-or-files db))) {:id :none :label "ohne"}))))

(rf/reg-sub
  :jups.backend.subs/files-dropdown
  (fn [db [_ images-or-files year]]
    (sort #(< (-> %1 :label .toLowerCase) (-> %2 :label .toLowerCase))
          (mapv (fn [file-name] {:id file-name :label file-name})
                (get-in db [images-or-files year])))))
