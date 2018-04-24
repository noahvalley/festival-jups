(ns webbackend.pages
  (:require
    [reagent.core :as r]
    [webbackend.fields :refer [field]]
    [webbackend.requests :refer [get-page update-page]]))


(defn pages-list [global]
  (let [session (r/cursor global [:session])]
    [:div
     [:button {:on-click (fn []
                           (update-page (name (:selected-page @global))
                                        (r/cursor global [:pages (:selected-page @global)])
                                        session))}
      "speichern"]
     [:ul (for [page (keys (:pages @global))]
            ^{:key page}
            [:li
             [:a {:style    {:cursor "pointer"}
                  :on-click (fn [e]
                              (swap! global #(assoc % :selected-page page)))}
              (name page)]])]]))

(defn pages-form [global]
  [:div {:style {:display        "flex"
                 :flex-direction "column"
                 :width          "100%"}}
   [field "textarea" (or (:selected-page @global) :home) "HTML" (r/cursor global [:pages])]
   ])

(defn pages [global]
  (dorun (for [page (keys (:pages @global))]
     (get-page global (name page) (r/cursor global [:pages page]))))
  [:div
   [pages-list global]
   [pages-form global]])