package com.captsoneteamsingo.ui.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.captsoneteamsingo.R
import com.captsoneteamsingo.data.dummy.InfoSingoItems

class InfoItemAdapter(private val infoList : List<InfoSingoItems>) : RecyclerView.Adapter<InfoItemAdapter.ItemInfoViewHolder>(){
    class ItemInfoViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val imageInfo : ImageView = itemView.findViewById(R.id.info_iv)
        val titleInfo : TextView = itemView.findViewById(R.id.info_tv)
        val descriptionInfo : TextView = itemView.findViewById(R.id.info_desc_tv)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ItemInfoViewHolder {
        val infoView = LayoutInflater.from(parent.context).inflate(R.layout.item_info, parent, false)
        return ItemInfoViewHolder(infoView)
    }

    override fun getItemCount(): Int {
        return infoList.size
    }

    override fun onBindViewHolder(holder: ItemInfoViewHolder, position: Int) {
        val ingpo = infoList[position]
        holder.imageInfo.setImageResource(ingpo.infoSingoImage)
        holder.titleInfo.text = ingpo.infoSingoTitle
        holder.descriptionInfo.text = ingpo.infoSingoDescription
    }
}