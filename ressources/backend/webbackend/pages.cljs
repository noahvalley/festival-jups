(ns webbackend.pages
  (:require
    [reagent.core :as r]
    [webbackend.fields :refer [field checkbox double-dropdown]]
    [webbackend.requests :refer [get-list update-page]]
    [webbackend.codemirror :refer [codemirror get-codemirror-content]]))


(defn pages-list [global]
  [:div
   {:style
    {:display         "flex"
     :flex-direction  "row"
     :justify-content "space-between"}}
   (for [page (keys (:pages @global))]
     ^{:key page}
     [:p
      [:a {:style    {:cursor "pointer"}
           :on-click (fn [e]
                       (swap! global #(assoc % :selected-page page)))}
       (name page)]])])

(defn pages-form [global]
  (let [session (r/cursor global [:session])
        page (name (:selected-page @global))]
    [:div {:style {:display        "flex"
                   :flex-direction "column"}}
     [:button
      {:on-click
       (fn []
         (update-page global page
                      (assoc (-> @global :pages ((:selected-page @global)))
                        :content (get-codemirror-content))
                      (r/cursor global [:pages (:selected-page @global)])))}
      "speichern"]
     (cond (#{"home" "orte" "kontakt" "archiv" "downloads"} [page]) nil
           (= "tickets" page) (let [tickets (r/cursor global [:pages :tickets])]
                                [:div
                                 [checkbox
                                  :showText
                                  "Text anzeigen"
                                  tickets]
                                 [checkbox
                                  :showForm
                                  "Formular anzeigen"
                                  tickets]
                                 [field
                                  "text"
                                  :contentFormSent
                                  "Text wenn Formular gesendet"
                                  tickets]])
           (= "programm" page) [:div
                                [checkbox
                                 :showText
                                 "Text anzeigen"
                                 (r/cursor global [:pages :programm])]
                                [checkbox
                                 :showProgramm
                                 "Programm anzeigen"
                                 (r/cursor global [:pages :programm])]])
     [:div {:style {:display "flex" :flex-direction "row"}}
      [double-dropdown global :pages-image :images "Bild" false]
      (if (and (:pages-image @global)
               (not (= "" (:pages-image @global))))
        [:p (str "<img src=\"" "http://api.festival-jups.ch/images/" (:pages-image @global) "\">")])]
     [:div {:style {:display "flex" :flex-direction "row"}}
      [double-dropdown global :pages-file :files "Datei" false]
      (if (and (:pages-file @global)
               (not (= "" (:pages-file @global))))
        [:p (str "<a href=\"" "http://api.festival-jups.ch/files/"  (:pages-file @global) "\" target=\"_blank\"></a>")])]
     [codemirror
      (-> @global
          :pages
          ((or (:selected-page @global) :home))
          :content)]]))

(defn pages [global]
  (fn [global]
    [:div {:style {:display "flex"
                   :flex-direction "column"}}
     [pages-list global]
     [pages-form global]]))