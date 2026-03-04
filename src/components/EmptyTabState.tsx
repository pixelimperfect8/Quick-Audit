/** Empty state shown when a tab has no document loaded */
export default function EmptyTabState() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-grey-100 gap-8 p-8">
      {/* Document illustration — matches Figma empty tab state */}
      <div className="relative w-[74px] h-[83px]">
        {/* Blue gradient document shape */}
        <svg
          width="74"
          height="83"
          viewBox="0 0 74.2098 82.9404"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.73057 0H65.4793C70.301 0 74.2098 3.90881 74.2098 8.73057V16.5912V74.2098C74.2098 79.0316 70.301 82.9404 65.4793 82.9404H8.73057C3.90881 82.9404 0 79.0316 0 74.2098V8.73057C0 3.90881 3.90881 0 8.73057 0Z"
            fill="url(#emptyDocGrad)"
          />
          <defs>
            <linearGradient
              id="emptyDocGrad"
              x1="7.4"
              y1="82.94"
              x2="75.03"
              y2="7.35"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#5E58FF" />
              <stop offset="1" stopColor="#B7DFFF" />
            </linearGradient>
          </defs>
        </svg>

        {/* White lines inside the document */}
        <div className="absolute top-[14px] left-[11px] flex flex-col gap-[9px]">
          {[52, 52, 52, 52].map((w, i) => (
            <div
              key={i}
              className="h-[7px] rounded-sm bg-white/40"
              style={{ width: w }}
            />
          ))}
        </div>

        {/* Green circle with plus icon — bottom right */}
        <div className="absolute bottom-0 right-0 translate-x-[4px] translate-y-[4px]">
          <svg
            width="39"
            height="39"
            viewBox="0 0 38.5891 38.5891"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="19.29" cy="19.29" r="19.29" fill="#67F7D8" fillOpacity="0.35" />
            <circle cx="19.29" cy="19.29" r="19.29" fill="url(#ovalGrad)" />
            <defs>
              <linearGradient
                id="ovalGrad"
                x1="24.12"
                y1="0"
                x2="9.99"
                y2="35.49"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#67F7D8" stopOpacity="0" />
                <stop offset="1" stopColor="#67F7D8" />
              </linearGradient>
            </defs>
          </svg>
          {/* Plus icon inside the circle */}
          <svg
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 8H8V13C8 13.55 7.55 14 7 14C6.45 14 6 13.55 6 13V8H1C0.45 8 0 7.55 0 7C0 6.45 0.45 6 1 6H6V1C6 0.45 6.45 0 7 0C7.55 0 8 0.45 8 1V6H13C13.55 6 14 6.45 14 7C14 7.55 13.55 8 13 8Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* Instructional text — matches Figma: 16px medium grey-800, centered */}
      <p className="text-grey-800 text-base font-medium text-center max-w-[320px] leading-6">
        Select a document to load it in this tab and keep your place in other files.
      </p>
    </div>
  );
}
