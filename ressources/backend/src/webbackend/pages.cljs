(ns webbackend.pages
  (:require
    [reagent.core :as r]
    [webbackend.fields :refer [field]]
    [webbackend.requests :refer [get-page update-page]]
    [webbackend.codemirror :refer [codemirror-area get-codemirror-content]]))


(defn pages-list [global]
  [:div
   {:style
    {:display         "flex"
     :flex-direction  "row"
     :justify-content "space-between"
     :width           "100%"}}
   (for [page (keys (:pages @global))]
     ^{:key page}
     [:p
      [:a {:style    {:cursor "pointer"}
           :on-click (fn [e]
                       (swap! global #(assoc % :selected-page page)))}
       (name page)]])])

(defn pages-form [global]
  (let [session (r/cursor global [:session])]
    [:div {:style {:display        "flex"
                   :flex-direction "column"}}
     [:button
      {:on-click
       (fn []
         (update-page (name (:selected-page @global))
                      (get-codemirror-content)
                      session))}
      "speichern"]
     [codemirror-area
      (-> @global
          :pages
          ((or (:selected-page @global) :home)))]]))

(defn pages [global]
  (dorun (for [page (keys (:pages @global))]
           (get-page global (name page) (r/cursor global [:pages page]))))
  (fn [global]
    [:div {:style {:display "flex"
                   :flex-direction "column"
                   :width          "100%"
                   :height "100%"}}
     [pages-list global]
     [pages-form global]]))