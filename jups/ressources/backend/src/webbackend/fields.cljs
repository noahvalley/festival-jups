(ns webbackend.fields)

(defn update-event [key event]
  (fn [e] (swap! event #(assoc % key (-> e .-target .-value)))))

(defn field [type key name event]
  [:div
   [:label {:for (str key)} (str name ": ")]
   [:input {:type      type
            :name      (str key)
            :value     (key @event)
            :on-change (update-event key event)}]])

(defn checkbox [key name event]
  [:div
   [:label {:for (str key)} (str name ": ")]
   [:input {:type      "checkbox"
            :name      (str key)
            :checked   (key @event)
            :on-change (fn [e] (swap! event #(assoc % key (if (-> e .-target .-checked) true false))))}]])