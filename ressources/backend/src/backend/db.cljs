(ns backend.db)

(def default-db
  {:error {:error false
           :message ""}
   :username ""
   :password ""
   :session nil
   :pages {}
   :events []
   :changed-events []
   :active-event nil})

(def empty-event
  {:ausverkauft false
   :preis       ""
   :titel       ""
   :abAlter     ""
   :type        ""
   :ort         ""
   :untertitel  ""
   :priority    "1"
   :id          nil
   :zeitBis     "2000-12-31T23:42"
   :zeitVon     "2000-12-31T23:42"
   :bild        nil
   :text ""})