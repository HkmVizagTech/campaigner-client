import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { getCampainer } from "@/store/campaigners/campaigners.service";
import CustomCard from "../utils/CustomCard";
import CustomCardSkeleton from "../utils/CustomCardSkeleton";
import { Input } from "../ui/input";

const PAGE_SIZE = 15;
const INITIAL_QUERY = {
  page: 1,
  search: "",
};

const queryReducer = (state, action) => {
  switch (action.type) {
    case "RESET_PAGE":
      if (state.page === INITIAL_QUERY.page) {
        return state;
      }

      return {
        ...state,
        page: INITIAL_QUERY.page,
      };

    case "SET_SEARCH":
      if (
        state.search === action.payload &&
        state.page === INITIAL_QUERY.page
      ) {
        return state;
      }

      return {
        page: INITIAL_QUERY.page,
        search: action.payload,
      };

    case "LOAD_NEXT_PAGE":
      return {
        ...state,
        page: state.page + 1,
      };

    default:
      return state;
  }
};

const CardSection = ({ currentCampaign }) => {
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");
  const [query, dispatchQuery] = useReducer(queryReducer, INITIAL_QUERY);
  const [campaigners, setCampaigners] = useState([]);
  const [campainersCount, setCampainersCount] = useState(0);
  const [campaginerTotalPages, setCampaginerTotalPages] = useState(0);
  const [campainerLoading, setCampainerLoading] = useState(false);

  const loaderRef = useRef(null);
  const isFetchingNextPageRef = useRef(false);

  const hasMoreCampaigners = useMemo(() => {
    if (campaginerTotalPages > 0) {
      return query.page < campaginerTotalPages;
    }

    return campaigners.length < campainersCount;
  }, [campaginerTotalPages, campaigners.length, campainersCount, query.page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatchQuery({
        type: "SET_SEARCH",
        payload: searchInput.trim(),
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setCampaigners([]);
    setCampainersCount(0);
    setCampaginerTotalPages(0);
    dispatchQuery({ type: "RESET_PAGE" });
  }, [currentCampaign?._id]);

  useEffect(() => {
    isFetchingNextPageRef.current = campainerLoading;
  }, [campainerLoading]);

  useEffect(() => {
    if (!currentCampaign?._id) return undefined;

    let isActive = true;
    setCampainerLoading(true);

    const request = dispatch(
      getCampainer({
        id: currentCampaign._id,
        status: "active",
        campStatus: "active",
        page: query.page,
        pageSize: PAGE_SIZE,
        search: query.search,
        infiniteScroll: true,
      }),
    );

    request
      .unwrap()
      .then((payload) => {
        if (!isActive) return;

        const nextCampaigners = payload?.campaigners ?? [];
        const totalPages = payload?.totalPages ?? 0;
        const count = payload?.count ?? 0;

        setCampaginerTotalPages(totalPages);
        setCampainersCount(count);
        setCampaigners((prev) => {
          if (query.page === 1) {
            return nextCampaigners;
          }

          const mergedCampaigners = [...prev, ...nextCampaigners];

          return Array.from(
            new Map(
              mergedCampaigners.map((campaigner, index) => [
                campaigner?._id ?? `${query.page}-${index}`,
                campaigner,
              ]),
            ).values(),
          );
        });
      })
      .catch(() => {
        if (!isActive) return;
      })
      .finally(() => {
        if (!isActive) return;

        setCampainerLoading(false);
      });

    return () => {
      isActive = false;
      request.abort();
    };
  }, [currentCampaign?._id, dispatch, query]);

  useEffect(() => {
    const currentLoader = loaderRef.current;

    if (!currentLoader || !currentCampaign?._id || !hasMoreCampaigners) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (!entry?.isIntersecting || isFetchingNextPageRef.current) return;

        if (campaginerTotalPages > 0 && query.page >= campaginerTotalPages) {
          return;
        }

        isFetchingNextPageRef.current = true;
        dispatchQuery({ type: "LOAD_NEXT_PAGE" });
      },
      {
        rootMargin: "200px",
        threshold: 0.1,
      },
    );

    observer.observe(currentLoader);

    return () => {
      observer.unobserve(currentLoader);
      observer.disconnect();
    };
  }, [
    campaginerTotalPages,
    currentCampaign?._id,
    hasMoreCampaigners,
    query.page,
  ]);

  return (
    <section className="mt-10" id="card-sections">
      <div className="mb-5 flex flex-col justify-between gap-2 px-2 md:flex-row">
        <h2 className="text font-semibold md:text-2xl">
          Campaigners Supporting This Seva ({campainersCount})
        </h2>

        <Input
          placeholder="Search campaigner..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="mb-3 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {campaigners?.map((campaginer, index) => (
          <CustomCard
            key={campaginer?._id}
            campainer={campaginer}
            index={index}
          />
        ))}

        {campainerLoading &&
          Array.from({ length: Math.min(PAGE_SIZE, 4) }).map((_, i) => (
            <CustomCardSkeleton key={i} />
          ))}
      </div>

      {hasMoreCampaigners && <div ref={loaderRef} className="h-10" />}

      {!campainerLoading && campaigners?.length === 0 && (
        <p>No Campaigners Found.</p>
      )}
    </section>
  );
};

export default CardSection;
