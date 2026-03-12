import { useEffect, useState, useRef } from "react";
import CustomCard from "../utils/CustomCard";
import CustomCardSkeleton from "../utils/CustomCardSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { getCampainer } from "@/store/campaigners/campaigners.service";
import { Input } from "../ui/input";
const PAGE_SIZE = 15;

const CardSection = ({ currentCampaign }) => {
  const dispatch = useDispatch();

  const { campainersCount, campaginers, campainerLoading } = useSelector(
    (state) => state.campaginer,
  );

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const loaderRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Initial load
  useEffect(() => {
    if (!currentCampaign?._id) return;

    setPage(1);

    dispatch(
      getCampainer({
        id: currentCampaign._id,
        status: "active",
        campStatus: "active",
        page: 1,
        pageSize: PAGE_SIZE,
        search: debouncedSearch,
        infiniteScroll: true,
      }),
    );
  }, [currentCampaign?._id, debouncedSearch, dispatch]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (
          first.isIntersecting &&
          !campainerLoading &&
          campaginers.length < campainersCount
        ) {
          const nextPage = page + 1;

          dispatch(
            getCampainer({
              id: currentCampaign._id,
              status: "active",
              campStatus: "active",
              page: nextPage,
              limit: PAGE_SIZE,
            }),
          );

          setPage(nextPage);
        }
      },
      { threshold: 1 },
    );

    const currentLoader = loaderRef.current;

    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [
    campaginers,
    campainerLoading,
    campainersCount,
    page,
    dispatch,
    currentCampaign,
  ]);

  return (
    <section className="mt-10" id="card-sections">
      <div className="flex gap-2 flex-col md:flex-row justify-between mb-5 px-2">
        <h2 className="text md:text-2xl font-semibold">
          Campaigners Supporting This Seva ({campainersCount})
        </h2>
        <Input
          placeholder="Search campaigner..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch mb-3">
        {campaginers?.map((campaginer, index) => (
          <CustomCard
            key={campaginer?._id}
            campainer={campaginer}
            index={index}
          />
        ))}

        {campainerLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <CustomCardSkeleton key={i} />
          ))}
      </div>

      {/* Trigger for infinite scroll */}
      <div ref={loaderRef} className="h-10" />

      {!campainerLoading && campaginers?.length === 0 && (
        <p>No Campaigners Found.</p>
      )}
    </section>
  );
};

export default CardSection;
