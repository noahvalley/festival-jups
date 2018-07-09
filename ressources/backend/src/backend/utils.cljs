(ns backend.utils)

(defn positions
  [pred coll]
  (keep-indexed (fn [idx x]
                  (when (pred x)
                    idx))
                coll))

(defn active-event-index [db]
  (first (positions #(= (:active-event db) (:id %)) (:changed-events db))))

(defn changed-event-index [db id]
  (first (positions #(= id (:id %)) (:changed-events db))))

(defn active-event [db]
  (get-in db [:changed-events (active-event-index db)]))

(defn active-event-unchanged-index [db]
  (first (positions #(= (:active-event db) (:id %)) (:events db))))

(defn active-event-unchanged [db]
  (get-in db [:events (active-event-unchanged-index db)]))

(defn new-date [previous-value date-string]
  (let [previous-time (clojure.string/replace previous-value #"....-..-.." "")]
    (str date-string previous-time)))

(defn new-time [previous-value goog-time]
  (let [previous-date (clojure.string/replace previous-value #"..:.." "")
        goog-time-str (str goog-time)
        [hours minutes] (case (count goog-time-str)
                            1 ["00" (str "0" goog-time-str)]
                            2 ["00" goog-time-str]
                            3 [(str "0" (first goog-time-str)) (apply str (rest goog-time-str))]
                            4 [(subs goog-time-str 0 2) (subs goog-time-str 2 4)])]
    (str previous-date hours ":" minutes)))
