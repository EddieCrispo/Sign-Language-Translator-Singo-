package com.captsoneteamsingo

import android.os.Bundle
import com.google.android.material.bottomnavigation.BottomNavigationView
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupActionBarWithNavController
import androidx.navigation.ui.setupWithNavController
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.captsoneteamsingo.data.dummy.InfoSingoItems
import com.captsoneteamsingo.databinding.ActivityMain2Binding
import com.captsoneteamsingo.ui.adapter.InfoItemAdapter

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMain2Binding
    private lateinit var recyclerView: RecyclerView
    private lateinit var infoList: ArrayList<InfoSingoItems>
    private lateinit var infoItemAdapter: InfoItemAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityMain2Binding.inflate(layoutInflater)
        setContentView(binding.root)

        val navView: BottomNavigationView = binding.navView

        val navController = findNavController(R.id.nav_host_fragment_activity_main2)
        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        val appBarConfiguration = AppBarConfiguration(
            setOf(
                R.id.navigation_home, R.id.navigation_dictionary, R.id.navigation_informations
            )
        )
//        setupActionBarWithNavController(navController, appBarConfiguration)
        navView.setupWithNavController(navController)
        supportActionBar?.hide()

        init()
    }

    private fun init() {
        recyclerView = findViewById(R.id.item_info_rv)
        recyclerView.setHasFixedSize(true)
        recyclerView.layoutManager = LinearLayoutManager(this, RecyclerView.HORIZONTAL, false)
        infoList = ArrayList()

        addDataInfoToList()

        infoItemAdapter = InfoItemAdapter(infoList)
        recyclerView.adapter = infoItemAdapter
    }

    private fun addDataInfoToList() {
        infoList.add(InfoSingoItems(R.drawable.banner_home, "Info Hari tunarungu sedunia", "Merayakan Hari tunarungu sedunia"))
        infoList.add(InfoSingoItems(R.drawable.banner_home, "Info Hari tunarungu sedunia", "Merayakan Hari tunarungu sedunia"))
        infoList.add(InfoSingoItems(R.drawable.banner_home, "Info Hari tunarungu sedunia", "Merayakan Hari tunarungu sedunia"))
    }
}