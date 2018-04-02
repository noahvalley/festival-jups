(ns webbackend.codemirror)

(defn random-form []
  (let [state (r/atom {:file nil})]
    (fn []
      [:div
       [:div
        [:div {:id "mirror" :style {:border "5px" :border-style "solid" :border-color "black"}}]]
       [:button
        {:on-click #(js/CodeMirror (js/document.getElementById "mirror" #js {:mode "htmlmixed"
                                                                             :smartIndent true
                                                                             :lineNumbers true}))}
        "edit"]
       [:div
        [:p "RANDOM"]
        [:input {:type      "file"
                 :on-change (fn [e]
                              (swap! file #(assoc
                                             %
                                             :file
                                             (.item (-> e .-target .-files) 0))))}]]
       #_[:div {:id "FILE"} (:file @state)]])))